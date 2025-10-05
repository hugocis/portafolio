import type { NextAuthOptions, Session, User } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import { PrismaAdapter } from "@auth/prisma-adapter"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// Custom adapter to handle username field
function CustomPrismaAdapter(p: typeof prisma) {
  const adapter = PrismaAdapter(p)

  return {
    ...adapter,
    createUser: async (user: User & { email: string; name?: string | null }) => {
      // Generate unique username
      let username = user.name?.toLowerCase().replace(/\s+/g, '_') || user.email?.split('@')[0] || 'user'
      let counter = 1

      // Ensure username is unique
      while (await p.user.findUnique({ where: { username } })) {
        username = `${user.name?.toLowerCase().replace(/\s+/g, '_') || user.email?.split('@')[0] || 'user'}_${counter}`
        counter++
      }

      // Create user with username
      const newUser = await p.user.create({
        data: {
          ...user,
          username
        }
      })

      // Create default portfolio for the user
      await p.portfolio.create({
        data: {
          userId: newUser.id,
          title: `${newUser.name || 'My'} Portfolio`,
          subtitle: 'Welcome to my professional portfolio',
          isPublic: true
        }
      })

      return newUser
    }
  }
}

export const authOptions: NextAuthOptions = {
  adapter: CustomPrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.OAUTH_GITHUB_ID || "",
      clientSecret: process.env.OAUTH_GITHUB_SECRET || "",
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
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.username = user.username
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && token.sub) {
        session.user.id = token.sub
        session.user.username = token.username as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
}