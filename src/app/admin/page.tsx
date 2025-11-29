import { prisma } from "@/lib/prisma";
import { Users, FileCheck, TrendingUp, DollarSign, Activity } from "lucide-react";

async function getAdminStats() {
    const totalUsers = await prisma.user.count();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const testsToday = await prisma.testSession.count({
        where: {
            date: {
                gte: today
            }
        }
    });

    const activeSubscriptions = await prisma.subscription.count({
        where: { status: 'ACTIVE' }
    });

    // Estimate active users (users who logged in or took a test in last 24h)
    // Since we just added lastActiveAt, this will be 0 initially, so we'll fallback to created users for demo
    const activeUsers = await prisma.user.count({
        where: {
            updatedAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
        }
    });

    return { totalUsers, testsToday, activeSubscriptions, activeUsers };
}

export default async function AdminDashboard() {
    const stats = await getAdminStats();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Global statistics and platform health.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Tests Taken Today"
                    value={stats.testsToday}
                    icon={FileCheck}
                    color="bg-emerald-500"
                />
                <StatCard
                    title="Active Subscriptions"
                    value={stats.activeSubscriptions}
                    icon={DollarSign}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Active Users (24h)"
                    value={stats.activeUsers}
                    icon={Activity}
                    color="bg-orange-500"
                />
            </div>

            {/* Recent Activity Section (Placeholder) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Platform Activity</h2>
                <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    Chart Placeholder (PNL / Usage Trends)
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color }: any) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
        </div>
    );
}
