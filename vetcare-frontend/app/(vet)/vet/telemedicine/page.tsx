"use client";

import Layout from '@/components/shared/Layout';
import { Video, Calendar as CalendarIcon, Phone, FileText } from 'lucide-react';

export default function TelemedicinePage() {
    const upcomingCalls = [
        { id: 1, patient: 'Bella (Golden Retriever)', owner: 'Sarah Johnson', time: '14:00 today', type: 'Follow-up' },
        { id: 2, patient: 'Max (Persian Cat)', owner: 'Mike Davis', time: '15:30 today', type: 'Initial Consult' },
    ];

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Telemedicine Portal</h1>
                        <p className="text-sm text-gray-500">Manage virtual consultations</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition shadow-sm font-medium">
                        <Video size={18} />
                        Start Instant Call
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="col-span-2 bg-black rounded-xl overflow-hidden shadow-sm border border-gray-100 flex items-center justify-center min-h-[400px] relative">
                        <div className="text-center text-gray-400">
                            <Video size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Waiting for call to start</p>
                        </div>

                        {/* Overlay controls - inactive */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
                            <button className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white opacity-50"><Video size={20} /></button>
                            <button className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white opacity-50"><Phone size={20} className="rotate-[135deg]" /></button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <CalendarIcon size={18} className="text-primary-600" />
                            Upcoming Consultations
                        </h3>
                        <div className="space-y-4">
                            {upcomingCalls.map(call => (
                                <div key={call.id} className="p-4 border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                                    <h4 className="font-medium text-gray-900">{call.patient}</h4>
                                    <p className="text-sm text-gray-500 mb-2">Owner: {call.owner}</p>
                                    <div className="flex justify-between items-center text-xs text-gray-600 font-medium">
                                        <span className="flex items-center gap-1 bg-white px-2 py-1 rounded shadow-sm"><Clock size={12} /> {call.time}</span>
                                        <span className="text-primary-600 bg-primary-50 px-2 py-1 rounded">{call.type}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

function Clock({ size, ...props }: any) {
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
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
    );
}
