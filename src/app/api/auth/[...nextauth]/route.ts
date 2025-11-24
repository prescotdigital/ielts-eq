import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"


export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as any, // Cast to any to avoid type mismatch with Prisma 7
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: '/signin',
        signOut: '/',
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
