"use client";

import Layout from '@/components/shared/Layout';
import { Search, Plus, Filter, FileText, Download } from 'lucide-react';
import { format } from 'date-fns';

export default function PrescriptionsPage() {
    const scripts = [
        { id: '1029', patient: 'Luna (Dog)', date: new Date().toISOString(), medication: 'Amoxicillin 250mg', status: 'active' },
        { id: '1030', patient: 'Milo (Cat)', date: new Date().toISOString(), medication: 'Flea & Tick Prevention', status: 'completed' },
    ];

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
                        <p className="text-sm text-gray-500">Manage patient medications</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition shadow-sm font-medium">
                        <Plus size={18} />
                        New Prescription
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center bg-gray-50/50">
                        <div className="relative flex-grow max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by patient or medication..."
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
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Patient</th>
                                <th className="px-6 py-4">Medication</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {scripts.map((script) => (
                                <tr key={script.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-medium text-gray-900">#{script.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{format(new Date(script.date), 'MMM d, yyyy')}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{script.patient}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{script.medication}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${script.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {script.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 text-gray-400">
                                            <button className="hover:text-primary-600" title="View Details"><FileText size={18} /></button>
                                            <button className="hover:text-gray-900" title="Download PDF"><Download size={18} /></button>
                                        </div>
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
