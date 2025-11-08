# Authentication Setup - Basha Lagbe

## Overview
This application uses **NextAuth v5** with **Google OAuth** for authentication and **MongoDB** for storing user data.

## Features
✅ Google OAuth authentication  
✅ MongoDB database integration with Mongoose  
✅ User profile images stored from Google  
✅ Role-based access control (user, host, admin)  
✅ Protected routes with middleware  
✅ Session management with database sessions  
✅ Professional UI with user avatars  

## Tech Stack
- **NextAuth v5 (beta)**: Modern authentication for Next.js
- **MongoDB**: Database for user data and sessions
- **Mongoose**: ODM for MongoDB
- **@auth/mongodb-adapter**: NextAuth adapter for MongoDB
- **Google OAuth**: Authentication provider

## Setup

### 1. Environment Variables
All required environment variables are already configured in `.env`:

```env
# MongoDB Connection
DATABASE_URL=mongodb+srv://...

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

### 2. Database Structure

#### User Model (`models/User.ts`)
```typescript
{
  name: String (required)
  email: String (required, unique)
  emailVerified: Date (nullable)
  image: String (nullable) - Google profile picture
  role: "user" | "host" | "admin" (default: "user")
  phone: String (nullable)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

#### NextAuth Collections (auto-created)
- `accounts`: OAuth provider accounts
- `sessions`: Active user sessions
- `users`: User data (synced with our User model)
- `verification_tokens`: Email verification tokens

## Usage

### Client Components

#### Using the useSession hook:
```typescript
import { useSession } from "next-auth/react"

export default function Component() {
  const { data: session, status } = useSession()
  
  if (status === "loading") return <div>Loading...</div>
  if (!session) return <div>Not authenticated</div>
  
  return <div>Welcome {session.user.name}!</div>
}
```

#### Using the custom hook:
```typescript
import { useCurrentUser } from "@/hooks/use-current-user"

export default function Component() {
  const { user, isAuthenticated, isLoading, role } = useCurrentUser()
  
  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Please sign in</div>
  
  return <div>User role: {role}</div>
}
```

#### Sign in/Sign out:
```typescript
import { signIn, signOut } from "next-auth/react"

// Sign in with Google
<button onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
  Sign in with Google
</button>

// Sign out
<button onClick={() => signOut({ callbackUrl: "/" })}>
  Sign Out
</button>
```

### Server Components & API Routes

#### Get current user:
```typescript
import { auth } from "@/lib/auth"

export default async function Page() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }
  
  return <div>Welcome {session.user.name}!</div>
}
```

#### Using helper functions:
```typescript
import { getCurrentUser, requireAuth } from "@/lib/session"

// Optional authentication
const user = await getCurrentUser() // returns user or undefined

// Required authentication (throws error if not authenticated)
const user = await requireAuth() // returns user or throws
```

## Protected Routes

Routes are protected using middleware (`middleware.ts`):

### Automatically Protected:
- `/dashboard` - User dashboard
- `/host/*` - Host management pages
- `/bookings/*` - Booking pages

### Adding More Protected Routes:
Edit `middleware.ts` and add to the `protectedRoutes` array:
```typescript
const protectedRoutes = ["/dashboard", "/host", "/bookings", "/your-route"]
```

## User Roles

Three roles are available:
1. **user** (default) - Regular renters
2. **host** - Property owners
3. **admin** - Platform administrators

### Checking Roles:
```typescript
// Client-side
const { role } = useCurrentUser()
if (role === "host") {
  // Show host features
}

// Server-side
const session = await auth()
if (session?.user?.role === "admin") {
  // Show admin features
}
```

## Session Management

- **Strategy**: Database sessions (recommended for production)
- **Max Age**: 30 days
- **Auto-refresh**: Yes
- **Secure**: HTTPS only in production

## Google Profile Images

User profile images from Google are:
1. Automatically fetched during sign-in
2. Stored in the `image` field of the User model
3. Updated if the user changes their Google profile picture
4. Displayed in the header with `next/image` component

### Image URL Format:
Google provides images in this format:
```
https://lh3.googleusercontent.com/a/[hash]
```

These are optimized by Next.js Image component for performance.

## API Endpoints

NextAuth automatically creates these endpoints:

- `GET /api/auth/signin` - Sign in page
- `GET /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get session data
- `POST /api/auth/signin/google` - Google OAuth
- `GET /api/auth/callback/google` - Google OAuth callback
- `GET /api/auth/csrf` - CSRF token

## Troubleshooting

### MongoDB Connection Issues:
- Verify `DATABASE_URL` is correct
- Ensure MongoDB Atlas IP whitelist includes your IP
- Check network connectivity

### Google OAuth Issues:
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Check authorized redirect URIs in Google Console
- Ensure redirect URI is: `http://localhost:3000/api/auth/callback/google`

### Session Not Persisting:
- Clear browser cookies
- Check `NEXTAUTH_SECRET` is set
- Verify MongoDB connection is working

### Images Not Loading:
Add to `next.config.mjs`:
```javascript
images: {
  domains: ['lh3.googleusercontent.com'],
}
```

## Security Best Practices

✅ Strong `NEXTAUTH_SECRET` (change in production)  
✅ HTTPS in production  
✅ MongoDB connection string secured  
✅ Google OAuth credentials secured  
✅ CORS properly configured  
✅ Rate limiting on auth endpoints (add in production)  

## Production Checklist

Before deploying to production:

- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Generate strong `NEXTAUTH_SECRET` (use `openssl rand -base64 32`)
- [ ] Add production domain to Google OAuth authorized URLs
- [ ] Enable HTTPS
- [ ] Set up MongoDB production cluster
- [ ] Configure environment variables on hosting platform
- [ ] Add error monitoring (Sentry, etc.)
- [ ] Set up backup strategy for MongoDB

## Additional Resources

- [NextAuth Documentation](https://authjs.dev/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Google OAuth Setup](https://console.cloud.google.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
