import { prisma } from "@/lib/prisma";
import { PNLChart, UsageChart, SubscriptionGrowthChart } from "@/components/admin/AnalyticsCharts";
import { DollarSign, TrendingUp, Users, Activity } from "lucide-react";

async function getAnalyticsData() {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    // 1. Fetch Subscriptions for PNL
    const subscriptions = await prisma.subscription.findMany({
        where: {
            createdAt: { gte: thirtyDaysAgo }
        },
        orderBy: { createdAt: 'asc' }
    });

    // 2. Fetch Analytics Events for Usage
    const events = await prisma.analyticsEvent.findMany({
        where: {
            createdAt: { gte: thirtyDaysAgo }
        },
        orderBy: { createdAt: 'asc' }
    });

    // 3. Fetch Tests for Usage
    const tests = await prisma.testSession.findMany({
        where: {
            date: { gte: thirtyDaysAgo }
        },
        orderBy: { date: 'asc' }
    });

    // Process Data for Charts
    const dailyData = new Map();

    // Initialize map with last 30 days
    for (let i = 0; i <= 30; i++) {
        const d = new Date(thirtyDaysAgo);
        d.setDate(d.getDate() + i);
        const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        dailyData.set(dateStr, {
            date: dateStr,
            revenue: 0,
            newSubs: 0,
            cancelledSubs: 0,
            vocab: 0,
            pronunciation: 0,
            tests: 0
        });
    }

    // Aggregate Subscriptions
    subscriptions.forEach(sub => {
        const dateStr = new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const day = dailyData.get(dateStr);
        if (day) {
            if (sub.status === 'ACTIVE') {
                day.newSubs++;
                day.revenue += sub.amount;
            } else if (sub.status === 'CANCELLED') {
                day.cancelledSubs++;
            }
        }
    });

    // Aggregate Events
    events.forEach(event => {
        const dateStr = new Date(event.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const day = dailyData.get(dateStr);
        if (day) {
            if (event.type === 'VOCAB_PRACTICE') day.vocab++;
            if (event.type === 'PRONUNCIATION_PRACTICE') day.pronunciation++;
        }
    });

    // Aggregate Tests
    tests.forEach(test => {
        const dateStr = new Date(test.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const day = dailyData.get(dateStr);
        if (day) {
            day.tests++;
        }
    });

    // Calculate Cumulative Revenue for Area Chart
    const chartData = Array.from(dailyData.values());
    let cumulativeRevenue = 0;
    chartData.forEach((day: any) => {
        cumulativeRevenue += day.revenue;
        day.revenue = cumulativeRevenue; // Overwrite daily revenue with cumulative for the chart
    });

    // Calculate Totals
    const totalRevenue = subscriptions
        .filter(s => s.status === 'ACTIVE')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const totalVocab = events.filter(e => e.type === 'VOCAB_PRACTICE').length;
    const totalPronunc = events.filter(e => e.type === 'PRONUNCIATION_PRACTICE').length;

    return { chartData, totalRevenue, totalVocab, totalPronunc };
}

export default async function AnalyticsPage() {
    const { chartData, totalRevenue, totalVocab, totalPronunc } = await getAnalyticsData();

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 font-medium">Est. Monthly Revenue</h3>
                        <div className="p-2 bg-emerald-100 rounded-lg">
                            <DollarSign className="w-5 h-5 text-emerald-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
                    <p className="text-sm text-emerald-600 mt-1 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" /> +12% vs last month
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 font-medium">Vocab Sessions</h3>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{totalVocab}</p>
                    <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 font-medium">Pronunciation Drills</h3>
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Activity className="w-5 h-5 text-orange-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{totalPronunc}</p>
                    <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* PNL Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Growth (Cumulative)</h3>
                    <PNLChart data={chartData} />
                </div>

                {/* Subscription Growth */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Subscription Trends</h3>
                    <SubscriptionGrowthChart data={chartData} />
                </div>

                {/* Feature Usage */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Feature Usage (Daily)</h3>
                    <UsageChart data={chartData} />
                </div>
            </div>
        </div>
    );
}
