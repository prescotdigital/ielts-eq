import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Mail, Calendar, Award, BookOpen, Mic } from "lucide-react";

export default async function UserDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const user = await prisma.user.findUnique({
        where: { id: params.id },
        include: {
            testSessions: {
                orderBy: { date: "desc" },
                take: 10
            },
            flashcardProgress: true,
            pronunciationProgress: true
        }
    });

    if (!user) {
        return <div>User not found</div>;
    }

    // Calculate stats
    const totalTests = user.testSessions.length;
    const averageScore = totalTests > 0
        ? (user.testSessions.reduce((acc, s) => acc + (s.score || 0), 0) / totalTests).toFixed(1)
        : "N/A";

    const vocabMastered = user.flashcardProgress.filter(p => p.status === 'MASTERED').length;
    const drillsCompleted = user.pronunciationProgress.length;

    return (
        <div className="space-y-8">
            <Link href="/admin/users" className="flex items-center text-gray-500 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Users
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-2xl">
                        {user.name?.[0] || user.email[0].toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{user.name || "No Name"}</h1>
                        <div className="flex items-center gap-4 text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                                <Mail className="w-4 h-4" /> {user.email}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" /> Joined {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {user.role}
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <Award className="w-5 h-5 text-emerald-500" />
                        <h3 className="font-medium text-gray-900">Test Performance</h3>
                    </div>
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-3xl font-bold text-gray-900">{averageScore}</p>
                            <p className="text-sm text-gray-500">Avg Band Score</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold text-gray-900">{totalTests}</p>
                            <p className="text-sm text-gray-500">Tests Taken</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="w-5 h-5 text-blue-500" />
                        <h3 className="font-medium text-gray-900">Vocabulary</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{vocabMastered}</p>
                    <p className="text-sm text-gray-500">Words Mastered</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <Mic className="w-5 h-5 text-orange-500" />
                        <h3 className="font-medium text-gray-900">Pronunciation</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{drillsCompleted}</p>
                    <p className="text-sm text-gray-500">Drills Completed</p>
                </div>
            </div>

            {/* Recent Tests Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="font-bold text-gray-900">Recent Test History</h3>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Score</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {user.testSessions.map((session) => (
                            <tr key={session.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {new Date(session.date).toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`font-bold ${(session.score || 0) >= 7 ? 'text-emerald-600' :
                                            (session.score || 0) >= 6 ? 'text-blue-600' : 'text-orange-600'
                                        }`}>
                                        {session.score || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {session.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <Link
                                        href={`/results/${session.id}`}
                                        target="_blank"
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        View Report
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {user.testSessions.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    No tests taken yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
