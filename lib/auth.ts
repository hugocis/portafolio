import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
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

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password || ""
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
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "github") {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! }
        })

        if (!existingUser) {
          // Generate a unique username from email or profile
          let username = user.email!.split('@')[0]
          let counter = 1
          
          // Ensure username is unique
          while (await prisma.user.findUnique({ where: { username } })) {
            username = `${user.email!.split('@')[0]}_${counter}`
            counter++
          }

          // Create user with username
          await prisma.user.update({
            where: { email: user.email! },
            data: { username }
          })
        }
      }
      return true
    }
  },
  pages: {
    signIn: "/auth/signin",
  },
}