import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "renter" | "owner" | "admin"
    } & DefaultSession["user"]
  }

  interface User {
    role: "renter" | "owner" | "admin"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: "renter" | "owner" | "admin"
  }
}
