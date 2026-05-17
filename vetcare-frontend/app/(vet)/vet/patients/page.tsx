"use client";

import { useEffect, useState } from 'react';
import Layout from '@/components/shared/Layout';
import { vetApi } from '@/lib/vetApi';
import { Search, User, ChevronRight, History, FileText, Activity } from 'lucide-react';
import Link from 'next/link';

export default function VetPatientsPage() {
    const [patients, setPatients] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // ... search logic (if endpoint exists, else just filter local if small)
        setLoading(false);
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Patient Directory</h1>
                    <p className="text-gray-500">Search and manage pet medical histories</p>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by pet name, owner, or species..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                        />
                    </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Placeholder for no search/empty state */}
                    <div className="md:col-span-2 lg:col-span-3 bg-white p-12 text-center rounded-lg border border-dashed border-gray-300">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                            <Search size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No Patients Found</h3>
                        <p className="text-gray-500 mt-1">Enter a search term above to find pets in our system.</p>
                    </div>
                </div>

                {/* Recent Patients Section */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Recently Visited</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between hover:border-primary-300 transition cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 font-bold">
                                    B
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Buddy</p>
                                    <p className="text-sm text-gray-500">Golden Retriever • John Doe</p>
                                </div>
                            </div>
                            <div className="flex gap-2 text-gray-400">
                                <History size={18} aria-label="View History" />
                                <FileText size={18} aria-label="Medical Record" />
                                <Activity size={18} aria-label="Lab Results" />
                            </div>
                        </div>
                        {/* Another placeholder */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between hover:border-primary-300 transition cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                    L
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Luna</p>
                                    <p className="text-sm text-gray-500">Persian Cat • Sarah Smith</p>
                                </div>
                            </div>
                            <div className="flex gap-2 text-gray-400">
                                <History size={18} aria-label="View History" />
                                <FileText size={18} aria-label="Medical Record" />
                                <Activity size={18} aria-label="Lab Results" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
