"use client";

import Layout from '@/components/shared/Layout';

export default function AttendancePage() {
    return (
        <Layout>
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Attendance & Leave</h1>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500">Attendance tracking and leave request management will be implemented here.</p>
                </div>
            </div>
        </Layout>
    );
}
