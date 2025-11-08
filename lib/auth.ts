import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

// Cache for user data to minimize database calls
const userCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          emailVerified: profile.email_verified ? new Date() : null,
          role: "renter" as const,
        }
      },
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide email and password")
        }

        const email = credentials.email as string
        const password = credentials.password as string

        await connectDB()

        // Find user and include password for comparison
        const user = await User.findOne({ email: email.toLowerCase() }).select("+password")

        if (!user) {
          throw new Error("Invalid email or password")
        }

        // If user signed up with Google, they don't have a password
        if (!user.password) {
          throw new Error("Please sign in with Google")
        }

        const isPasswordValid = await user.comparePassword(password)

        if (!isPasswordValid) {
          throw new Error("Invalid email or password")
        }

        return {
          id: String(user._id),
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          await connectDB()

          // Check if user exists in our User model
          let existingUser = await User.findOne({ email: user.email })

          if (!existingUser) {
            // Create new user with Google profile data
            existingUser = await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              emailVerified: new Date(),
              role: "renter",
              password: null, // Google users don't have passwords
            })
            console.log("Created new Google user:", existingUser.email)
          } else {
            // Update existing user's image if it changed
            if (existingUser.image !== user.image) {
              existingUser.image = user.image
              await existingUser.save()
            }
            console.log("Existing Google user logged in:", existingUser.email)
          }

          // Clear cache for this user
          userCache.delete(user.email!)
        } catch (error) {
          console.error("Google sign-in error:", error)
          return false // Prevent sign in if there's an error
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session.user && token) {
        const cacheKey = token.email as string
        const cached = userCache.get(cacheKey)

        // Check if cache is still valid
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          session.user.id = cached.data.id
          session.user.role = cached.data.role
          session.user.image = cached.data.image
          return session
        }

        // Fetch from database if not cached
        await connectDB()
        const dbUser = await User.findOne({ email: token.email }).lean()

        if (dbUser) {
          const userData = {
            id: String(dbUser._id),
            role: dbUser.role as "renter" | "owner" | "admin",
            image: dbUser.image || null,
          }

          // Update session
          session.user.id = userData.id
          session.user.role = userData.role
          session.user.image = userData.image

          // Cache the data
          userCache.set(cacheKey, {
            data: userData,
            timestamp: Date.now(),
          })
        } else {
          // Fallback to token data
          session.user.id = token.id as string
          session.user.role = (token.role as "renter" | "owner" | "admin") || "renter"
          session.user.image = (token.image as string) || null
        }
      }
      return session
    },
    async jwt({ token, user, account, trigger }) {
      // Initial sign in
      if (user) {
        // Fetch user data from database to get the role
        await connectDB()
        const dbUser = await User.findOne({ email: user.email }).lean()
        
        if (dbUser) {
          token.id = String(dbUser._id)
          token.role = dbUser.role
          token.image = dbUser.image
        } else {
          token.id = user.id
          token.role = "renter" // Default role
          token.image = user.image
        }
      }

      // Handle session update trigger (e.g., when role is updated)
      if (trigger === "update" && token.email) {
        // Clear cache
        userCache.delete(token.email as string)
        
        // Refetch user data from database
        await connectDB()
        const dbUser = await User.findOne({ email: token.email }).lean()
        
        if (dbUser) {
          token.id = String(dbUser._id)
          token.role = dbUser.role
          token.image = dbUser.image
        }
      }

      return token
    },
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user
      const protectedPaths = ["/dashboard", "/host", "/bookings"]
      const isProtectedPath = protectedPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
      )

      if (isProtectedPath && !isLoggedIn) {
        return false
      }

      return true
    },
    async redirect({ url, baseUrl }) {
      // If redirecting to the app after sign in
      if (url.startsWith(baseUrl)) {
        return url
      }
      // Otherwise go to base URL
      return baseUrl
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt", // Using JWT for better performance with credentials
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
})
