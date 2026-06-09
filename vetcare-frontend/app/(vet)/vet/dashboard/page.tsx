"use client";

import { useEffect, useState } from 'react';
import Layout from '@/components/shared/Layout';
import { vetApi } from '@/lib/vetApi';
import { Calendar, Users, FlaskConical, AlertCircle, Clock, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function VetDashboard() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [stats, setStats] = useState({
        today: 0,
        pending: 0,
        labResults: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await vetApi.getTodayAppointments();
                setAppointments(response.data);
                setStats({
                    today: response.data.length,
                    pending: response.data.filter((a: any) => a.status === 'pending').length,
                    labResults: 0, // Placeholder
                });
            } catch (error) {
                console.error('Failed to fetch vet dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Vet Dashboard</h1>
                    <p className="text-sm text-gray-500">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary-100 text-primary-600 rounded-lg">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Today's Visits</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.today}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Pending</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                                <FlaskConical size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Lab Results</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.labResults}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Urgent Cases</p>
                                <p className="text-2xl font-bold text-gray-900">0</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Today's Queue */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="font-semibold text-gray-900">Today's Appointment Queue</h2>
                            <Link href="/vet/schedule" className="text-sm text-primary-600 hover:underline">View Schedule</Link>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {loading ? (
                                <div className="p-8 text-center text-gray-500">Loading appointments...</div>
                            ) : appointments.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">No appointments scheduled for today.</div>
                            ) : (
                                appointments.map((apt) => (
                                    <div key={apt.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 font-bold">
                                                {apt.pet?.name?.[0] || 'P'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{apt.pet?.name} ({apt.pet?.species})</p>
                                                <p className="text-sm text-gray-500">
                                                    {format(new Date(apt.scheduledAt), 'HH:mm')} • {apt.type}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${apt.status === 'pending' ? 'bg-blue-100 text-blue-700' :
                                                apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {apt.status}
                                            </span>
                                            <button className="p-2 hover:bg-gray-200 rounded-full text-gray-400 active:bg-gray-300">
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Side Panels */}
                    <div className="space-y-6">
                        {/* Urgent Alerts */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <AlertCircle className="text-red-500" size={18} />
                                Critical Alerts
                            </h3>
                            <div className="space-y-3">
                                <p className="text-sm text-gray-500 italic">No critical alerts currently.</p>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                            <div className="grid grid-cols-1 gap-2">
                                <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition">
                                    📝 New Medical Record
                                </button>
                                <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition">
                                    💊 Create Prescription
                                </button>
                                <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition">
                                    🧪 Order Lab Test
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
