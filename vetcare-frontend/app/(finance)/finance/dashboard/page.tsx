"use client";

import { useEffect, useState } from 'react';
import Layout from '@/components/shared/Layout';
import { financeApi } from '@/lib/financeApi';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line
} from 'recharts';
import { DollarSign, FileText, TrendingUp, AlertCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function FinanceDashboard() {
    const [data, setData] = useState<any>({
        revenueData: [
            { name: 'Mon', revenue: 4000 },
            { name: 'Tue', revenue: 3000 },
            { name: 'Wed', revenue: 5000 },
            { name: 'Thu', revenue: 2780 },
            { name: 'Fri', revenue: 1890 },
            { name: 'Sat', revenue: 2390 },
            { name: 'Sun', revenue: 3490 },
        ],
        stats: {
            totalRevenue: 22550,
            outstanding: 4200,
            monthlyGrowth: 12.5,
            pendingInvoices: 8,
        }
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // In a real app, we'd fetch this from the API
        // const response = await financeApi.getRevenueReport({ period: 'weekly' });
    }, []);

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Financial Overview</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
                        <Calendar size={16} />
                        <span>This Week: {format(new Date(), 'MMM d')} - {format(new Date(), 'MMM d')}</span>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                <DollarSign size={20} />
                            </div>
                            <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                                <TrendingUp size={12} /> +12%
                            </span>
                        </div>
                        <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">${data.stats.totalRevenue.toLocaleString()}</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                                <AlertCircle size={20} />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-gray-500">Outstanding</p>
                        <p className="text-2xl font-bold text-gray-900">${data.stats.outstanding.toLocaleString()}</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <FileText size={20} />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-gray-500">Pending Invoices</p>
                        <p className="text-2xl font-bold text-gray-900">{data.stats.pendingInvoices}</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                <TrendingUp size={20} />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-gray-500">Monthly Growth</p>
                        <p className="text-2xl font-bold text-gray-900">{data.stats.monthlyGrowth}%</p>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-semibold text-gray-900 mb-6">Revenue Trend (7 Days)</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        cursor={{ fill: '#f9fafb' }}
                                    />
                                    <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={32} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-semibold text-gray-900 mb-6">Invoicing Health</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data.revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
