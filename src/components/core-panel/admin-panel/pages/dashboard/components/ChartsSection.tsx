import React, { useMemo } from 'react';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

interface PurchaseStatusStat {
    status: string;
    count: number;
    [key: string]: string | number;
}

interface MonthlyRevenueItem {
    month: string;
    revenue: number;
}

interface UserGrowthItem {
    month: string;
    count: number;
}

interface ChartsData {
    purchaseStatusStats: PurchaseStatusStat[];
    monthlyRevenue: MonthlyRevenueItem[];
    topSellingPackages: any[];
    userGrowth: UserGrowthItem[];
}

interface ChartsSectionProps {
    charts: ChartsData;
}

const STATUS_COLORS: Record<string, string> = {
    active: '#22c55e',
    expired: '#ef4444',
    pending: '#f97316',
    cancelled: '#6b7280',
};

function formatMonthLabel(month: string) {
    try {
        const date = new Date(`${month}-01`);
        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    } catch {
        return month;
    }
}

export default function ChartsSection({ charts }: ChartsSectionProps) {
    const purchaseStatusData = charts.purchaseStatusStats || [];
    const userGrowthData = (charts.userGrowth || []).map((item) => ({
        label: formatMonthLabel(item.month),
        users: item.count,
    }));

    const monthlyRevenueData = (charts.monthlyRevenue || []).map((item) => ({
        label: formatMonthLabel(item.month),
        revenue: item.revenue,
    }));

    return (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* User Growth */}
            <div className="col-span-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        User Growth
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">By month</span>
                </div>
                {userGrowthData.length ? (
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={userGrowthData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#64748b" />
                                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#64748b" />
                                <Tooltip
                                    contentStyle={{
                                        background: '#1e293b',
                                        border: '1px solid #334155',
                                        color: '#f1f5f9',
                                    }}
                                    wrapperStyle={{
                                        color: '#f1f5f9',
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#2563eb"
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p className="py-10 text-center text-xs text-slate-500 dark:text-slate-400">
                        No user growth data available yet.
                    </p>
                )}
            </div>

            {/* Monthly Revenue */}
            <div className="col-span-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        Monthly Revenue
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">USD</span>
                </div>
                {monthlyRevenueData.length ? (
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyRevenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#64748b" />
                                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#64748b" />
                                <Tooltip
                                    contentStyle={{
                                        background: '#1e293b',
                                        border: '1px solid #334155',
                                        color: '#f1f5f9',
                                    }}
                                    wrapperStyle={{
                                        color: '#f1f5f9',
                                    }}
                                />
                                <Bar dataKey="revenue" radius={[6, 6, 0, 0]} fill="#22c55e" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p className="py-10 text-center text-xs text-slate-500 dark:text-slate-400">
                        Revenue data will appear once you start generating sales.
                    </p>
                )}
            </div>

            {/* Purchase Status */}
            <div className="col-span-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        Purchase Status
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">All purchases</span>
                </div>
                {purchaseStatusData.length ? (
                    <div className="flex h-56 flex-col items-center justify-center">
                        <div className="h-40 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={purchaseStatusData}
                                        dataKey="count"
                                        nameKey="status"
                                        outerRadius={70}
                                        innerRadius={40}
                                        paddingAngle={3}
                                    >
                                        {purchaseStatusData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={STATUS_COLORS[entry.status] || '#6366f1'}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            background: '#1e293b',
                                            border: '1px solid #334155',
                                            color: '#f1f5f9',
                                        }}
                                        wrapperStyle={{
                                            color: '#f1f5f9',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-2 flex flex-wrap justify-center gap-2">
                            {purchaseStatusData.map((item) => (
                                <div
                                    key={item.status}
                                    className="inline-flex items-center gap-2 rounded-full bg-slate-50 dark:bg-slate-800 px-3 py-1 text-xs"
                                >
                                    <span
                                        className="h-2 w-2 rounded-full"
                                        style={{ backgroundColor: STATUS_COLORS[item.status] || '#6366f1' }}
                                    />
                                    <span className="font-medium capitalize text-slate-700 dark:text-slate-200">
                                        {item.status}
                                    </span>
                                    <span className="text-slate-500 dark:text-slate-400">
                                        {item.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="py-10 text-center text-xs text-slate-500 dark:text-slate-400">
                        No purchase status data available yet.
                    </p>
                )}
            </div>
        </section>
    );
}
