import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight, FileText, CheckCircle, AlertCircle } from "lucide-react";

export default async function TestListPage({
    searchParams,
}: {
    searchParams: { page?: string; status?: string };
}) {
    const page = parseInt(searchParams.page || "1");
    const status = searchParams.status || "ALL";
    const limit = 10;
    const skip = (page - 1) * limit;

    const where = status !== "ALL" ? { status } : {};

    const [tests, total] = await Promise.all([
        prisma.testSession.findMany({
            where,
            take: limit,
            skip,
            orderBy: { date: "desc" },
            include: {
                user: {
                    select: { name: true, email: true }
                }
            }
        }),
        prisma.testSession.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Test Logs</h1>
                <div className="flex gap-2">
                    <Link
                        href="/admin/tests?status=ALL"
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${status === 'ALL' ? 'bg-slate-900 text-white' : 'bg-white text-gray-700 border border-gray-300'
                            }`}
                    >
                        All
                    </Link>
                    <Link
                        href="/admin/tests?status=COMPLETED"
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${status === 'COMPLETED' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
                            }`}
                    >
                        Completed
                    </Link>
                    <Link
                        href="/admin/tests?status=IN_PROGRESS"
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${status === 'IN_PROGRESS' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
                            }`}
                    >
                        In Progress
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Score</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {tests.map((test) => (
                            <tr key={test.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {new Date(test.date).toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-medium text-gray-900">{test.user.name || "No Name"}</p>
                                        <p className="text-xs text-gray-500">{test.user.email}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`font-bold ${(test.score || 0) >= 7 ? 'text-emerald-600' :
                                            (test.score || 0) >= 6 ? 'text-blue-600' : 'text-orange-600'
                                        }`}>
                                        {test.score || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${test.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {test.status === 'COMPLETED' ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                        {test.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <Link
                                        href={`/admin/tests/${test.id}`}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        Inspect
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                    Showing {skip + 1} to {Math.min(skip + limit, total)} of {total} tests
                </p>
                <div className="flex gap-2">
                    {page > 1 && (
                        <Link
                            href={`/admin/tests?page=${page - 1}&status=${status}`}
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Link>
                    )}
                    {page < totalPages && (
                        <Link
                            href={`/admin/tests?page=${page + 1}&status=${status}`}
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
