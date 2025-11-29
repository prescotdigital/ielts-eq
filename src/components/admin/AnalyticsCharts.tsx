"use client";

import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";

export function PNLChart({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip />
                <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="Revenue ($)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

export function UsageChart({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="vocab" name="Vocabulary" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pronunciation" name="Pronunciation" fill="#f97316" radius={[4, 4, 0, 0]} />
                <Bar dataKey="tests" name="Tests" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}

export function SubscriptionGrowthChart({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="new" name="New Subs" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="cancelled" name="Cancelled" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
        </ResponsiveContainer>
    );
}
