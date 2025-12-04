import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle, Globe, Mail } from "lucide-react";

export default async function LoginAttemptsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; status?: string }>;
}) {
    const { page = "1", status = "all" } = await searchParams;
    const currentPage = parseInt(page);
    const pageSize = 20;

    // Build filter
    const where: any = {};
    if (status === "success") {
        where.success = true;
    } else if (status === "failed") {
        where.success = false;
    }

    // Fetch attempts with pagination
    const [attempts, totalCount] = await Promise.all([
        prisma.loginAttempt.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: pageSize,
            skip: (currentPage - 1) * pageSize,
        }),
        prisma.loginAttempt.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div className="space-y-6">
            <div>
                <Link href="/admin" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Login Attempts</h1>
                <p className="text-gray-500 mt-1">Monitor authentication activity and troubleshoot login issues</p>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                <Link
                    href="/admin/login-attempts?status=all"
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${status === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                    All
                </Link>
                <Link
                    href="/admin/login-attempts?status=success"
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${status === 'success' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                    Successful
                </Link>
                <Link
                    href="/admin/login-attempts?status=failed"
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${status === 'failed' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                    Failed
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {attempts.map((attempt) => (
                            <tr key={attempt.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {new Date(attempt.createdAt).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {attempt.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="flex items-center gap-2">
                                        {attempt.provider === 'google' ? (
                                            <>
                                                <Globe className="w-4 h-4 text-blue-600" />
                                                <span>Google</span>
                                            </>
                                        ) : (
                                            <>
                                                <Mail className="w-4 h-4 text-gray-600" />
                                                <span>Email</span>
                                            </>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {attempt.success ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                            <CheckCircle className="w-3 h-3" />
                                            Success
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            <XCircle className="w-3 h-3" />
                                            Failed
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {attempt.error || '—'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {attempt.user ? (
                                        <Link
                                            href={`/admin/users/${attempt.userId}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {attempt.user.name || attempt.user.email}
                                        </Link>
                                    ) : (
                                        <span className="text-gray-400">—</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {attempts.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    No login attempts found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{" "}
                        <span className="font-medium">{Math.min(currentPage * pageSize, totalCount)}</span> of{" "}
                        <span className="font-medium">{totalCount}</span> attempts
                    </p>
                    <div className="flex gap-2">
                        {currentPage > 1 && (
                            <Link
                                href={`/admin/login-attempts?page=${currentPage - 1}&status=${status}`}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Previous
                            </Link>
                        )}
                        {currentPage < totalPages && (
                            <Link
                                href={`/admin/login-attempts?page=${currentPage + 1}&status=${status}`}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Next
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
