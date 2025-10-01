import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          username: user.username,
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      if (token && token.sub) {
        session.user.id = token.sub
        session.user.username = token.username as string
      }
      return session
    },
    async signIn({ user, account }) {
      if (account?.provider === "github") {
        try {
          // Check if user already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (!existingUser) {
            // Generate a unique username from GitHub username or email
            let username = user.name?.toLowerCase().replace(/\s+/g, '_') || user.email!.split('@')[0]
            let counter = 1
            
            // Ensure username is unique
            while (await prisma.user.findUnique({ where: { username } })) {
              username = `${user.name?.toLowerCase().replace(/\s+/g, '_') || user.email!.split('@')[0]}_${counter}`
              counter++
            }

            // User will be created automatically by the adapter
            // We just need to update with username after creation
            setTimeout(async () => {
              try {
                await prisma.user.update({
                  where: { email: user.email! },
                  data: { username }
                })
              } catch (error) {
                console.error('Error updating username:', error)
              }
            }, 100)
          }
        } catch (error) {
          console.error('Error in signIn callback:', error)
        }
      }
      return true
    }
  },
  pages: {
    signIn: "/auth/signin",
  },
}