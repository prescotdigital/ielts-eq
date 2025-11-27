import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Play, History, TrendingUp, Award, LogOut, Book, Brain, ArrowRight, Mic, Volume2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import SupportTicket from "@/components/SupportTicket";

export default async function Dashboard() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin");
    }

    // Fetch user's test sessions
    let testSessions: any[] = [];
    try {
        testSessions = await prisma.testSession.findMany({
            where: {
                user: {
                    email: session.user?.email || ''
                },
                status: 'COMPLETED'
            },
            orderBy: {
                date: 'desc'
            },
            take: 5
        });
    } catch (error) {
        console.error('Failed to fetch test sessions:', error);
        // Continue with empty array
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                        EQ
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-900">Dashboard</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Welcome, {session.user?.name}</span>
                    <Link href="/api/auth/signout" className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                        <LogOut className="w-5 h-5" />
                    </Link>
                </div>
            </nav>

            <main className="container mx-auto px-6 py-10">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Action Card */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
                            <div className="relative z-10">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to practice?</h2>
                                <p className="text-gray-600 mb-8 max-w-md">
                                    Take a full IELTS Speaking mock test. Record your answers and get instant AI feedback on your performance.
                                </p>
                                <Link
                                    href="/test"
                                    className="inline-flex items-center gap-2 bg-primary hover:bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold transition-all shadow-lg shadow-emerald-200"
                                >
                                    <Play className="w-5 h-5" /> Start New Test
                                </Link>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <History className="w-5 h-5 text-gray-400" /> Recent Activity
                            </h3>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                {testSessions.length > 0 ? (
                                    <div className="divide-y divide-gray-100">
                                        {testSessions.map((test) => (
                                            <Link
                                                key={test.id}
                                                href={`/results/${test.id}`}
                                                className="p-6 hover:bg-gray-50 transition-colors flex justify-between items-center"
                                            >
                                                <div>
                                                    <p className="font-bold text-gray-900">IELTS Speaking Mock Test</p>
                                                    <p className="text-sm text-gray-500">{new Date(test.date).toLocaleDateString()}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-primary">{test.score || 'N/A'}</p>
                                                    <p className="text-xs text-gray-400 uppercase font-bold">Band Score</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        <p>No tests taken yet.</p>
                                        <p className="text-sm mt-2">Complete your first test to see your history here.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Vocabulary Builder Card */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:border-emerald-200 transition-all">
                            <div className="flex items-start justify-between relative z-10">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                                            <Book className="w-6 h-6" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Vocabulary Builder</h2>
                                    </div>
                                    <p className="text-gray-600 mb-6 max-w-md">
                                        Master the Academic Word List (AWL) with interactive flashcards and quizzes.
                                    </p>
                                    <Link
                                        href="/practice/vocabulary"
                                        className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 hover:underline"
                                    >
                                        Start Practicing <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                                <div className="hidden sm:block">
                                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center">
                                        <Brain className="w-12 h-12 text-emerald-200" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pronunciation Lab Card */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:border-blue-200 transition-all">
                            <div className="flex items-start justify-between relative z-10">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                            <Mic className="w-6 h-6" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Pronunciation Lab</h2>
                                    </div>
                                    <p className="text-gray-600 mb-6 max-w-md">
                                        Improve your accent and clarity with AI-powered phoneme drills.
                                    </p>
                                    <Link
                                        href="/practice/pronunciation"
                                        className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 hover:underline"
                                    >
                                        Start Training <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                                <div className="hidden sm:block">
                                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
                                        <Volume2 className="w-12 h-12 text-blue-200" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Stats */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-purple-500" /> Your Progress
                            </h3>
                            <div className="space-y-4">
                                <ProgressItem label="Fluency" value={0} color="bg-emerald-500" />
                                <ProgressItem label="Lexical Resource" value={0} color="bg-blue-500" />
                                <ProgressItem label="Grammar" value={0} color="bg-purple-500" />
                                <ProgressItem label="Pronunciation" value={0} color="bg-orange-500" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-6 rounded-2xl shadow-lg text-white">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                    <Award className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-purple-100 font-medium">Current Level</p>
                                    <p className="text-xl font-bold">Beginner</p>
                                </div>
                            </div>
                            <p className="text-sm text-purple-100 leading-relaxed">
                                Keep practicing to unlock detailed insights and reach Band 7.0+!
                            </p>
                        </div>

                        <SupportTicket />
                    </div>
                </div>
            </main >
        </div >
    );
}

function ProgressItem({ label, value, color }: { label: string, value: number, color: string }) {
    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{label}</span>
                <span className="text-gray-500">{value}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }}></div>
            </div>
        </div>
    );
}
