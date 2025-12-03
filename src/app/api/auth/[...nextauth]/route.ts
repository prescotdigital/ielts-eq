import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"


export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as any, // Cast to any to avoid type mismatch with Prisma 7
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user || !user.password) {
                    return null;
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);

                if (!isValid) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: '/signin',
        signOut: '/',
    },
    callbacks: {
        async session({ session, token }) {
            // console.log("Session Callback - Token:", token);
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as any;
            }
            return session;
        },
        async jwt({ token, user, account, profile }) {
            // console.log("JWT Callback - User:", user?.email, "Account:", account?.provider);
            if (user) {
                console.log("JWT: User signed in:", user.email, user.id);
                token.id = user.id;
                token.role = (user as any).role;
            }
            return token;
        },
        async signIn({ user, account, profile }) {
            console.log("SignIn Callback:", {
                email: user.email,
                id: user.id,
                provider: account?.provider,
                providerAccountId: account?.providerAccountId
            });
            return true;
        }
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
