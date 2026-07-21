import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock_client_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock_client_secret",
    }),
  ],
  pages: {
    signIn: '/login', // We can create a custom login page later if needed
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        // @ts-expect-error
        session.user.id = token.sub
      }
      return session
    }
  }
})

export { handler as GET, handler as POST }
