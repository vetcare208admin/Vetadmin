"use client";

import { useEffect, useState } from 'react';
import Layout from '@/components/shared/Layout';
import { Users, UserCheck, Calendar, Clock, ChevronRight } from 'lucide-react';
import { hrApi } from '@/lib/hrApi';

export default function HRDashboard() {
    const [stats, setStats] = useState({
        totalStaff: 42,
        presentToday: 38,
        onLeave: 4,
        pendingLeaves: 7,
    });

    return (
        <Layout>
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">HR Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Staff</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalStaff}</p>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users size={24} /></div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Present Today</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.presentToday}</p>
                        </div>
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg"><UserCheck size={24} /></div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">On Leave</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.onLeave}</p>
                        </div>
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Calendar size={24} /></div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.pendingLeaves}</p>
                        </div>
                        <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg"><Clock size={24} /></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Pending Leave Requests</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">Dr. Sarah Jenkins</p>
                                    <p className="text-sm text-gray-500">Annual Leave: May 10 - May 14</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="text-sm px-3 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100">Approve</button>
                                    <button className="text-sm px-3 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100">Reject</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-gray-900">Recent Onboarding</h3>
                            <button className="text-sm text-primary-600 hover:text-primary-700 flex items-center">View All <ChevronRight size={16} /></button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg bg-gray-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">JD</div>
                                    <div>
                                        <p className="font-medium text-gray-900">John Doe</p>
                                        <p className="text-sm text-gray-500">Lab Technician</p>
                                    </div>
                                </div>
                                <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded-full uppercase">In Progress</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
