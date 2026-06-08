// import NextAuth from "next-auth"
// import Google from "next-auth/providers/google"
// import { PrismaAdapter } from "@auth/prisma-adapter"
// import { prisma } from "@/lib/prisma"


// const handler = NextAuth({
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     // Github({
//     //   clientId: process.env.AUTH_GITHUB_ID!,
//     //   clientSecret: process.env.AUTH_GITHUB_SECRET!,
//     // }),
//     Google({
//       clientId: process.env.AUTH_GOOGLE_ID!,
//       clientSecret: process.env.AUTH_GOOGLE_SECRET!,
//     }),
//   ],
//   session: { strategy: "database" },
//   callbacks: {
//     session({ session, user }) {
//       if (session.user) {
//         session.user.image = user.id
//       }
//       return session
//     },
//   },
// })

// export { handler as GET, handler as POST }
// export const auth = handler

// auth.t
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  providers: [

    Github({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  session: { strategy: "database" },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
})
