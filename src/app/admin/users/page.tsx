import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import PaginationControls from "@/components/ui/pagination-controls";
import PasswordResetButton from "@/components/admin/PasswordResetButton";

export default async function UserListPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; page?: string }>;
}) {
    const { q: query = "", page: pageString = "1" } = await searchParams;
    const page = parseInt(pageString);
    const limit = 10;
    const skip = (page - 1) * limit;

    const where = query
        ? {
            OR: [
                { email: { contains: query, mode: "insensitive" as const } },
                { name: { contains: query, mode: "insensitive" as const } },
            ],
        }
        : {};

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            take: limit,
            skip,
            orderBy: { createdAt: "desc" },
            include: {
                _count: {
                    select: { testSessions: true }
                }
            }
        }),
        prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <form>
                        <input
                            name="q"
                            defaultValue={query}
                            placeholder="Search users..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                        />
                    </form>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Tests Taken</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Joined</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                            {user.name?.[0] || user.email[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{user.name || "No Name"}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {user._count.testSessions}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <PasswordResetButton
                                        userId={user.id}
                                        userEmail={user.email}
                                        hasPassword={!!user.password}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <PaginationControls
                hasNextPage={page < totalPages}
                hasPrevPage={page > 1}
                totalPages={totalPages}
                totalCount={total}
            />
        </div>
    );
}
