import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, FileText, Code, MessageSquare } from "lucide-react";

export default async function TestDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const test = await prisma.testSession.findUnique({
        where: { id },
        include: {
            user: true,
            responses: {
                include: {
                    question: true
                },
                orderBy: { createdAt: "asc" }
            }
        }
    });

    if (!test) {
        return <div>Test not found</div>;
    }

    let analysisData = null;
    try {
        if (test.analysis) {
            analysisData = JSON.parse(test.analysis);
        }
    } catch (e) {
        console.error("Failed to parse analysis JSON", e);
    }

    return (
        <div className="space-y-8">
            <Link href="/admin/tests" className="flex items-center text-gray-500 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Logs
            </Link>

            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Test Inspection</h1>
                    <p className="text-gray-500">ID: {test.id}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Taken by</p>
                    <Link href={`/admin/users/${test.userId}`} className="font-medium text-blue-600 hover:underline">
                        {test.user.name} ({test.user.email})
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Transcript Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                        <MessageSquare className="w-5 h-5 text-gray-700" />
                        <h2 className="text-xl font-bold text-gray-900">Transcript</h2>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6 max-h-[800px] overflow-y-auto">
                        {test.responses.map((response, index) => (
                            <div key={response.id} className="space-y-2">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Examiner</span>
                                    <p className="text-gray-800 font-medium">{response.question.text}</p>
                                </div>
                                <div className="pl-4 border-l-2 border-blue-500">
                                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Candidate</span>
                                    <p className="text-gray-700">{response.transcript || "(No transcript available)"}</p>
                                    {response.audioUrl && (
                                        <audio controls src={response.audioUrl} className="mt-2 w-full h-8" />
                                    )}
                                </div>
                            </div>
                        ))}
                        {test.responses.length === 0 && (
                            <p className="text-gray-500 italic">No responses recorded.</p>
                        )}
                    </div>
                </div>

                {/* Analysis & Debug Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Code className="w-5 h-5 text-gray-700" />
                        <h2 className="text-xl font-bold text-gray-900">Analysis Data</h2>
                    </div>

                    <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-6 overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-slate-400 text-sm font-mono">raw_analysis.json</span>
                            <span className="text-emerald-400 font-bold">Score: {test.score || 'N/A'}</span>
                        </div>
                        <pre className="text-xs text-slate-300 font-mono overflow-x-auto max-h-[700px]">
                            {analysisData ? JSON.stringify(analysisData, null, 2) : "// No analysis data available"}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}
