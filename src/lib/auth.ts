import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
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
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as any;
            }
            return session;
        },
        async jwt({ token, user, account, profile }) {
            // On initial sign in (when user object exists)
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
            }

            // For OAuth providers, ensure user exists in database
            if (account?.provider === 'google' && profile?.email) {
                const existingUser = await prisma.user.findUnique({
                    where: { email: profile.email }
                });

                if (existingUser) {
                    // User exists, use their data
                    token.id = existingUser.id;
                    token.role = existingUser.role;

                    // Check if account link exists
                    const accountLink = await prisma.account.findFirst({
                        where: {
                            userId: existingUser.id,
                            provider: 'google'
                        }
                    });

                    // Create account link if it doesn't exist
                    if (!accountLink && account.providerAccountId) {
                        await prisma.account.create({
                            data: {
                                userId: existingUser.id,
                                type: account.type,
                                provider: account.provider,
                                providerAccountId: account.providerAccountId,
                                refresh_token: account.refresh_token,
                                access_token: account.access_token,
                                expires_at: account.expires_at,
                                token_type: account.token_type,
                                scope: account.scope,
                                id_token: account.id_token,
                            }
                        });
                    }
                } else {
                    // Create new user with Google
                    const newUser = await prisma.user.create({
                        data: {
                            email: profile.email,
                            name: profile.name || null,
                            image: (profile as any).picture || null,
                            emailVerified: new Date(),
                            role: 'USER',
                        }
                    });

                    // Create account link
                    if (account.providerAccountId) {
                        await prisma.account.create({
                            data: {
                                userId: newUser.id,
                                type: account.type,
                                provider: account.provider,
                                providerAccountId: account.providerAccountId,
                                refresh_token: account.refresh_token,
                                access_token: account.access_token,
                                expires_at: account.expires_at,
                                token_type: account.token_type,
                                scope: account.scope,
                                id_token: account.id_token,
                            }
                        });
                    }

                    token.id = newUser.id;
                    token.role = newUser.role;
                }
            }

            return token;
        },
        async signIn({ user, account, profile }) {
            // Log login attempt
            try {
                const email = user?.email || (profile as any)?.email;
                const provider = account?.provider || 'unknown';

                if (email) {
                    // Find user by email to get userId
                    const existingUser = await prisma.user.findUnique({
                        where: { email }
                    });

                    await prisma.loginAttempt.create({
                        data: {
                            email,
                            userId: existingUser?.id,
                            provider,
                            success: true,
                            error: null,
                        }
                    });
                }
            } catch (error) {
                console.error('Failed to log login attempt:', error);
                // Don't block login if logging fails
            }

            return true;
        }
    },
    debug: process.env.NODE_ENV === 'development',
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                domain: process.env.NODE_ENV === 'production' ? '.ieltseq.com' : undefined
            }
        }
    }
}
