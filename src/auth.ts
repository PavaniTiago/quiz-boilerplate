import NextAuth, { NextAuthConfig } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { z } from 'zod'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './lib/prisma'
import { compare } from 'bcrypt-ts'

// Function to retrieve a user by email
async function getUser(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    return user
  } catch (error) {
    console.error('Database error:', error)
    throw new Error('Internal server error')
  }
}

// NextAuth configuration
export const config: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/', // Redirect to the sign-in page
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnQuizPage = nextUrl.pathname.startsWith('/quiz')
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')

      if (isOnQuizPage) {
        // Allow quiz access even if not fully authenticated
        return true
      } else if (isOnDashboard && isLoggedIn) {
        // Only allow dashboard access if fully authenticated
        return true
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }
      return false // Redirect unauthenticated users
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
    async signIn({ user }) {
      // Progressive authentication: check if the user needs to be fully authenticated
      const existingUser = await getUser(user.email!)
      if (!existingUser) {
        // Register new user if they don't exist
        await prisma.user.create({
          data: {
            email: user.email!,
            password: null, // Password will be added upon full authentication
          },
        })
      }
      return true
    },
    async redirect({ url, baseUrl }) {
      // Redirect to the quiz or dashboard depending on the state
      if (url === baseUrl) {
        return `${baseUrl}/quiz`
      }
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }
      return baseUrl
    },
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('Missing credentials')
        }

        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string() })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          const user = await getUser(email)

          // Simulate password check (ensure you have hashed passwords in your DB)
          if (user?.password) {
            const passwordsMatch = await compare(password, user.password)
            if (passwordsMatch) {
              return user
            }
          }
        }

        console.log('Invalid credentials')
        return null
      },
    }),
  ],
}

// Default export for NextAuth handler
export const { auth, signIn, signOut, handlers } = NextAuth(config)
