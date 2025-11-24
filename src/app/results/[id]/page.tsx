import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, PlayCircle, BarChart3, Mic } from 'lucide-react';
import { notFound } from 'next/navigation';

async function getTestSession(id: string) {
    try {
        const session = await prisma.testSession.findUnique({
            where: { id },
            include: {
                responses: {
                    include: { question: true },
                    orderBy: { createdAt: 'asc' }
                }
            }
        });
        return session;
    } catch (error) {
        console.error('Failed to fetch test session:', error);
        return null;
    }
}

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getTestSession(id);

    if (!session) {
        notFound();
    }

    // Check if analysis is complete
    const isAnalyzed = session.score !== null;

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 p-6 shadow-sm sticky top-0 z-10">
                <div className="container mx-auto max-w-5xl flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">EQ</div>
                        <span className="font-bold text-gray-900">IELTS EQ Report</span>
                    </div>
                </div>
            </header>

            <main className="container mx-auto max-w-5xl p-6 space-y-8">
                {/* If not analyzed yet, show message */}
                {!isAnalyzed ? (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <BarChart3 className="w-10 h-10 text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Analysis Pending</h2>
                        <p className="text-gray-600 mb-8">
                            Your test responses have been recorded but haven't been analyzed yet.
                            The AI analysis runs when you complete the test.
                        </p>
                        <Link
                            href="/dashboard"
                            className="inline-block px-8 py-4 bg-primary text-white rounded-full font-bold hover:bg-emerald-600 transition-colors"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Overall Score Card */}
                        <div className="bg-gradient-to-br from-primary to-emerald-600 text-white rounded-3xl p-12 text-center shadow-2xl">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <CheckCircle2 className="w-8 h-8" />
                                <h1 className="text-2xl font-bold">Test Complete!</h1>
                            </div>
                            <div className="text-7xl font-bold mb-2">{session.score?.toFixed(1)}</div>
                            <p className="text-emerald-100 text-lg">Overall Band Score</p>
                        </div>

                        {/* Response History */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-gray-900">Your Responses</h3>
                            <div className="space-y-4">
                                {session.responses.map((response: any, i: number) => {
                                    const feedback = response.feedback ? JSON.parse(response.feedback) : null;

                                    // Helper function to get CEFR level color
                                    const getCEFRColor = (level: string) => {
                                        const colors: Record<string, string> = {
                                            'A1': 'bg-red-100 text-red-700 border-red-200',
                                            'A2': 'bg-orange-100 text-orange-700 border-orange-200',
                                            'B1': 'bg-yellow-100 text-yellow-700 border-yellow-200',
                                            'B2': 'bg-blue-100 text-blue-700 border-blue-200',
                                            'C1': 'bg-indigo-100 text-indigo-700 border-indigo-200',
                                            'C2': 'bg-purple-100 text-purple-700 border-purple-200',
                                        };
                                        return colors[level] || 'bg-gray-100 text-gray-700 border-gray-200';
                                    };

                                    return (
                                        <div key={response.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                                            {/* Header */}
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md uppercase">
                                                            Part {response.question.part || 1}
                                                        </span>
                                                        {feedback?.cefr_level && (
                                                            <span className={`text-xs font-bold px-2 py-1 rounded-md border ${getCEFRColor(feedback.cefr_level)}`}>
                                                                {feedback.cefr_level}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="font-bold text-gray-900">{response.question.text}</p>
                                                </div>
                                                {feedback && (
                                                    <div className="text-right ml-4">
                                                        <div className="text-2xl font-bold text-emerald-600">{feedback.score}</div>
                                                        <div className="text-xs text-gray-500">Band Score</div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Your Response */}
                                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                                    <span>📝</span> Your Response
                                                </h4>
                                                <p className="text-gray-700 italic leading-relaxed">"{response.transcript}"</p>
                                            </div>

                                            {/* Feedback Sections */}
                                            {feedback && (
                                                <div className="space-y-3">
                                                    {/* Grammar Errors */}
                                                    {feedback.grammar_errors && feedback.grammar_errors.length > 0 && (
                                                        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                                                            <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                                <span>❌</span> Grammar Issues
                                                            </h4>
                                                            <ul className="space-y-2">
                                                                {feedback.grammar_errors.map((error: string, idx: number) => (
                                                                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                                                        <span className="text-red-500 mt-0.5">•</span>
                                                                        <span>{error}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {/* Pronunciation Tips */}
                                                    {feedback.pronunciation_issues && feedback.pronunciation_issues.length > 0 && (
                                                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                                            <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                                <span>🗣️</span> Pronunciation Tips
                                                            </h4>
                                                            <ul className="space-y-2">
                                                                {feedback.pronunciation_issues.map((tip: string, idx: number) => (
                                                                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                                                        <span className="text-blue-500 mt-0.5">•</span>
                                                                        <span>{tip}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {/* Improved Version */}
                                                    {feedback.improved_response && (
                                                        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                                                            <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                                <span>✨</span> Improved Version
                                                            </h4>
                                                            <p className="text-gray-800 leading-relaxed">{feedback.improved_response}</p>
                                                            <p className="text-xs text-emerald-600 mt-2 italic">
                                                                This version demonstrates better grammar, vocabulary, and coherence.
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* No Feedback Yet */}
                                            {!feedback && (
                                                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-center">
                                                    <p className="text-sm text-yellow-700">
                                                        ⏳ Detailed feedback is being generated. Please check back shortly.
                                                    </p>
                                                </div>
                                            )}

                                            {/* Audio Player */}
                                            <div className="pt-2">
                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                                    <span>🔊</span> Listen to Your Recording
                                                </h4>
                                                <audio
                                                    controls
                                                    src={(() => {
                                                        try {
                                                            const url = new URL(response.audioUrl);
                                                            return `/api/audio?key=${encodeURIComponent(url.pathname.substring(1))}`;
                                                        } catch (e) {
                                                            return response.audioUrl;
                                                        }
                                                    })()}
                                                    className="w-full h-10"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Back to Dashboard */}
                        <div className="text-center pt-8">
                            <Link
                                href="/dashboard"
                                className="inline-block px-8 py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-colors"
                            >
                                Back to Dashboard
                            </Link>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
