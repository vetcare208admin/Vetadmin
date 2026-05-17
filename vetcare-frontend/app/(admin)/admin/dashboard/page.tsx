"use client";

import { useEffect, useState } from 'react';
import Layout from '@/components/shared/Layout';
import { adminApi } from '@/lib/adminApi';
import { Building2, Users, Receipt, CreditCard, Activity, Bell } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminDashboard() {
    const [analytics, setAnalytics] = useState<any>(null);
    const [branches, setBranches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [analyticsRes, branchesRes] = await Promise.all([
                    adminApi.getAnalyticsOverview(),
                    adminApi.getBranches()
                ]);
                setAnalytics(analyticsRes.data);
                setBranches(branchesRes.data);
            } catch (error) {
                console.error('Failed to fetch admin dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const stats = [
        { label: 'Total Users', value: analytics?.totalUsers || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Total Appointments', value: analytics?.totalAppointments || 0, icon: Activity, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Total Invoices', value: analytics?.totalInvoices || 0, icon: Receipt, color: 'text-purple-600', bg: 'bg-purple-100' },
        { label: 'Total Revenue', value: `$${(analytics?.totalRevenue || 0).toLocaleString()}`, icon: CreditCard, color: 'text-orange-600', bg: 'bg-orange-100' },
    ];

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
                        <p className="text-gray-500 text-sm">Super Admin Dashboard</p>
                    </div>
                    <p className="text-sm text-gray-500">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Branches List */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="font-semibold text-gray-900">Branch Management</h2>
                            <button className="text-sm text-primary-600 hover:underline font-medium">Add Branch</button>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {loading ? (
                                <div className="p-8 text-center text-gray-500">Loading branches...</div>
                            ) : branches.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">No branches found.</div>
                            ) : (
                                branches.map((branch) => (
                                    <div key={branch.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                                                <Building2 size={24} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{branch.name}</p>
                                                <p className="text-sm text-gray-500">{branch.address}</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex items-center gap-6">
                                            <div className="text-sm">
                                                <p className="font-medium text-gray-900">{branch._count?.users || 0} Users</p>
                                                <p className="text-gray-500 text-xs">{branch._count?.appointments || 0} Appts</p>
                                            </div>
                                            <button className="px-3 py-1 text-sm border border-gray-200 rounded-md hover:bg-gray-100 transition">
                                                Manage
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Side Panels */}
                    <div className="space-y-6">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Activity className="text-blue-500" size={18} />
                                System Health
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 px-2 rounded-full bg-green-50 text-green-700">API Server</span>
                                    <span className="font-medium text-green-600">Online</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 px-2 rounded-full bg-green-50 text-green-700">Database</span>
                                    <span className="font-medium text-green-600">Stable</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-1 gap-2">
                                <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-100 transition flex items-center gap-2">
                                    <Users size={16} /> Manage All Users
                                </button>
                                <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-100 transition flex items-center gap-2">
                                    <Bell size={16} /> Broadcast Message
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
