"use client";

import { useEffect, useState } from 'react';
import Layout from '@/components/shared/Layout';
import { financeApi } from '@/lib/financeApi';
import { Search, Filter, MoreVertical, Download, Send, CreditCard } from 'lucide-react';
import { format } from 'date-fns';

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchInvoices() {
            try {
                const response = await financeApi.getInvoices();
                setInvoices(response.data);
            } catch (error) {
                console.error('Failed to fetch invoices:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchInvoices();
    }, []);

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition font-medium shadow-sm flex items-center gap-2 text-sm">
                        <PlusIcon size={18} />
                        Create Invoice
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center bg-gray-50/50">
                        <div className="relative flex-grow max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by invoice # or customer..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md hover:bg-gray-100 text-sm font-medium text-gray-600">
                                <Filter size={16} /> Filter
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md hover:bg-gray-100 text-sm font-medium text-gray-600">
                                <Download size={16} /> Export
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                                    <th className="px-6 py-4">Invoice</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-500">Loading invoices...</td></tr>
                                ) : invoices.length === 0 ? (
                                    <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-500">No invoices found.</td></tr>
                                ) : (
                                    invoices.map((inv) => (
                                        <tr key={inv.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-gray-900">INV-{inv.id.slice(-6).toUpperCase()}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-900">{inv.customer?.fullName || 'N/A'}</p>
                                                <p className="text-xs text-gray-500">{inv.customer?.phone}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-600">{format(new Date(inv.createdAt), 'MMM d, yyyy')}</p>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-900">${inv.total?.toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${inv.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                        inv.status === 'overdue' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {inv.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 text-gray-400">
                                                    <button title="Send email" className="hover:text-primary-600"><Send size={18} /></button>
                                                    <button title="Download PDF" className="hover:text-gray-900"><Download size={18} /></button>
                                                    <button className="hover:text-gray-900"><MoreVertical size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

function PlusIcon({ size, ...props }: any) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    );
}
