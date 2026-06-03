"use client";

import { useEffect, useState } from 'react';
import Layout from '@/components/shared/Layout';
import { adminApi } from '@/lib/adminApi';
import { Building2, MapPin, Phone, Users, Plus, Loader2 } from 'lucide-react';

export default function BranchesPage() {
    const [branches, setBranches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newBranch, setNewBranch] = useState({ name: '', address: '', phone: '' });

    useEffect(() => {
        fetchBranches();
    }, []);

    async function fetchBranches() {
        try {
            const response = await adminApi.getBranches();
            setBranches(response.data);
        } catch (error) {
            console.error('Failed to fetch branches:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateBranch(e: React.FormEvent) {
        e.preventDefault();
        try {
            await adminApi.createBranch(newBranch);
            setIsCreateModalOpen(false);
            setNewBranch({ name: '', address: '', phone: '' });
            fetchBranches();
        } catch (error) {
            console.error('Failed to create branch:', error);
        }
    }

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Branch Management</h1>
                        <p className="text-gray-500 text-sm">Manage all locations across the platform</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
                    >
                        <Plus size={20} />
                        New Branch
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <Loader2 className="animate-spin text-primary-600 mb-4" size={40} />
                        <p className="text-gray-500 font-medium">Loading branches...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {branches.map((branch) => (
                            <div key={branch.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:border-primary-200 transition-colors group">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-gray-50 rounded-xl text-gray-600 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                            <Building2 size={24} />
                                        </div>
                                        <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">
                                            Active
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{branch.name}</h3>
                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <MapPin size={16} />
                                            {branch.address}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Phone size={16} />
                                            {branch.phone}
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-sm font-medium">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Users size={16} className="text-gray-400" />
                                            {branch._count?.users || 0} Staff Members
                                        </div>
                                        <button className="text-primary-600 hover:text-primary-700">Manage</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Simple Create Modal Placeholder */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Create New Branch</h2>
                        <form onSubmit={handleCreateBranch} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Branch Name</label>
                                <input
                                    required
                                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                    value={newBranch.name}
                                    onChange={e => setNewBranch({ ...newBranch, name: e.target.value })}
                                    placeholder="e.g. Downtown Clinic"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Address</label>
                                <input
                                    required
                                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                    value={newBranch.address}
                                    onChange={e => setNewBranch({ ...newBranch, address: e.target.value })}
                                    placeholder="Full street address"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                                <input
                                    required
                                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                    value={newBranch.phone}
                                    onChange={e => setNewBranch({ ...newBranch, phone: e.target.value })}
                                    placeholder="+1 234 567 890"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-bold"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
}
