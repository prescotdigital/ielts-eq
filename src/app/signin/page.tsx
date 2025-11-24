"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function SignIn() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";
    const error = searchParams?.get("error");

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
                {/* Left Side - Branding */}
                <div className="bg-gradient-to-br from-primary via-emerald-600 to-emerald-700 p-12 flex flex-col justify-center text-white relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative z-10">
                        {/* Logo */}
                        <div className="flex items-center gap-3 mb-12">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                                <span className="text-2xl font-bold text-primary">EQ</span>
                            </div>
                            <span className="text-2xl font-bold">IELTS EQ</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                            Master English.<br />
                            Ace Your IELTS.
                        </h1>

                        <p className="text-lg text-emerald-50 mb-10 leading-relaxed">
                            AI-powered speaking practice for immigration, university admission, and career advancement.
                        </p>

                        {/* Features */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-6 h-6 flex-shrink-0" />
                                <span className="text-emerald-50">Realistic IELTS exam simulation</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-6 h-6 flex-shrink-0" />
                                <span className="text-emerald-50">Instant AI-powered feedback</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-6 h-6 flex-shrink-0" />
                                <span className="text-emerald-50">Track your progress to Band 7+</span>
                            </div>
                        </div>

                        {/* Illustration */}
                        <div className="mt-12 rounded-2xl overflow-hidden border-4 border-white/20">
                            <Image
                                src="/signin-illustration.png"
                                alt="IELTS EQ Learning"
                                width={500}
                                height={350}
                                className="w-full h-auto"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Side - Sign In Form */}
                <div className="p-12 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">
                            Welcome Back
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Sign in to continue your IELTS speaking practice
                        </p>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                {error === "OAuthAccountNotLinked"
                                    ? "This email is already associated with another account."
                                    : "Sign in error. Please try again."}
                            </div>
                        )}

                        {/* Google Sign In Button */}
                        <button
                            onClick={() => signIn("google", { callbackUrl })}
                            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all shadow-sm hover:shadow-md group"
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            <span>Continue with Google</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-500">
                                By signing in, you agree to our{" "}
                                <a href="#" className="text-primary hover:underline">
                                    Terms of Service
                                </a>{" "}
                                and{" "}
                                <a href="#" className="text-primary hover:underline">
                                    Privacy Policy
                                </a>
                            </p>
                        </div>

                        {/* Benefits */}
                        <div className="mt-10 p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <p className="text-sm font-semibold text-gray-900 mb-3">
                                What you'll get:
                            </p>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                    <span>Unlimited full IELTS speaking mock tests</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                    <span>Detailed AI analysis with band scores</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                    <span>Progress tracking and improvement insights</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
