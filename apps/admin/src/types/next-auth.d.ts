import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    refreshToken?: string
    user: {
      id: string
      email: string
      name?: string | null
      roles?: any[]
    }
  }

  interface User {
    accessToken?: string
    refreshToken?: string
    roles?: any[]
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    roles?: any[]
  }
}
