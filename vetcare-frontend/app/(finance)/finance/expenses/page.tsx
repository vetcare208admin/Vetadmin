"use client";

import { useEffect, useState } from 'react';
import Layout from '@/components/shared/Layout';
import { financeApi } from '@/lib/financeApi';
import { Search, Plus, Upload, Filter, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // financeApi.getExpenses() ...
        setExpenses([
            { id: '1', date: new Date().toISOString(), category: 'Supplies', vendor: 'MedicalCo', amount: 1250.00, status: 'approved' },
            { id: '2', date: new Date().toISOString(), category: 'Utilities', vendor: 'City Power', amount: 450.50, status: 'approved' },
            { id: '3', date: new Date().toISOString(), category: 'Marketing', vendor: 'Facebook', amount: 200.00, status: 'pending' },
        ]);
    }, []);

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
                        <p className="text-sm text-gray-500">Track and manage clinic expenditures</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition shadow-sm font-medium">
                        <Plus size={18} />
                        Record Expense
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center bg-gray-50/50">
                        <div className="relative flex-grow max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search vendor or category..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md hover:bg-gray-100 text-sm font-medium text-gray-600">
                                <Filter size={16} /> Filter
                            </button>
                        </div>
                    </div>

                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Vendor</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {expenses.map((exp) => (
                                <tr key={exp.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm text-gray-600">{format(new Date(exp.date), 'MMM d, yyyy')}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{exp.vendor}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{exp.category}</td>
                                    <td className="px-6 py-4 font-bold text-gray-900">${exp.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${exp.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {exp.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
                                            <Upload size={14} /> Upload
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}
