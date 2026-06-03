"use client";

import Layout from '@/components/shared/Layout';
import { Search, Plus, Filter, MoreVertical, Mail } from 'lucide-react';

export default function StaffDirectoryPage() {
    const staff = [
        { id: 1, name: 'Dr. Sarah Jenkins', role: 'VET_DOCTOR', department: 'Medicine', email: 'sarah@vetcare.com', status: 'active' },
        { id: 2, name: 'Mark Davis', role: 'LAB_TECH', department: 'Laboratory', email: 'mark@vetcare.com', status: 'active' },
        { id: 3, name: 'Emily Chen', role: 'ACCOUNTANT', department: 'Finance', email: 'emily@vetcare.com', status: 'on_leave' },
    ];

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Staff Directory</h1>
                        <p className="text-sm text-gray-500">Manage employee records and profiles</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition shadow-sm font-medium">
                        <Plus size={18} />
                        Add Staff Member
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center bg-gray-50/50">
                        <div className="relative flex-grow max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search staff by name or role..."
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
                                <th className="px-6 py-4">Employee</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {staff.map((employee) => (
                                <tr key={employee.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                                                {employee.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{employee.name}</p>
                                                <p className="text-xs text-gray-500">{employee.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">{employee.role}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{employee.department}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${employee.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {employee.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 text-gray-400">
                                            <button className="hover:text-primary-600"><Mail size={18} /></button>
                                            <button className="hover:text-gray-900"><MoreVertical size={18} /></button>
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
