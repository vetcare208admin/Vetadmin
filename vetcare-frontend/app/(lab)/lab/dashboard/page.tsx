"use client";

import { useEffect, useState } from 'react';
import Layout from '@/components/shared/Layout';
import { labApi } from '@/lib/labApi';
import { FlaskConical, Clock, CheckCircle2, AlertCircle, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

export default function LabDashboard() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const response = await labApi.getOrders();
                setOrders(response.data);
            } catch (error) {
                console.error('Failed to fetch lab orders:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, []);

    const columns = [
        { id: 'pending', title: 'Pending', icon: <Clock size={18} className="text-blue-500" /> },
        { id: 'in_progress', title: 'In Progress', icon: <FlaskConical size={18} className="text-primary-500" /> },
        { id: 'done', title: 'Completed', icon: <CheckCircle2 size={18} className="text-green-500" /> },
    ];

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Laboratory Dashboard</h1>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search orders..."
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                            />
                        </div>
                        <button className="p-2 border border-gray-200 rounded-md hover:bg-gray-50">
                            <Filter size={18} className="text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Kanban Board */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:h-[calc(100vh-200px)]">
                    {columns.map(column => (
                        <div key={column.id} className="flex flex-col bg-gray-50 rounded-xl border border-gray-200">
                            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white rounded-t-xl">
                                <div className="flex items-center gap-2 font-semibold text-gray-700">
                                    {column.icon}
                                    {column.title}
                                </div>
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-bold">
                                    {orders.filter(o => o.status === column.id).length}
                                </span>
                            </div>
                            <div className="p-3 flex-grow overflow-y-auto space-y-3">
                                {loading ? (
                                    <div className="p-4 bg-white rounded-lg shadow-sm animate-pulse space-y-3">
                                        <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                                    </div>
                                ) : orders.filter(o => o.status === column.id).length === 0 ? (
                                    <div className="text-center py-10 text-gray-400 text-sm italic">
                                        No {column.title.toLowerCase()} orders
                                    </div>
                                ) : (
                                    orders.filter(o => o.status === column.id).map(order => (
                                        <div key={order.id} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-primary-300 transition cursor-pointer group">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${order.priority === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    #{order.id.slice(-6)}
                                                </span>
                                                {order.priority === 'urgent' && <AlertCircle size={14} className="text-red-500" />}
                                            </div>
                                            <h4 className="font-semibold text-gray-900 mb-1">{order.pet?.name || 'Unknown Patient'}</h4>
                                            <p className="text-xs text-gray-500 mb-3">{order.tests?.length || 0} Test(s)</p>
                                            <div className="flex justify-between items-center text-[10px] text-gray-400">
                                                <span>{format(new Date(order.createdAt), 'MMM d, HH:mm')}</span>
                                                <div className="flex -space-x-1">
                                                    <div className="w-5 h-5 rounded-full bg-primary-100 border border-white flex items-center justify-center text-[8px] font-bold text-primary-700">
                                                        {order.vet?.user?.email?.[0].toUpperCase() || 'V'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
