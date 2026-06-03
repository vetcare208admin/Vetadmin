"use client";

import Layout from '@/components/shared/Layout';

export default function LabOrderDetailPage({ params }: { params: { id: string } }) {
    return (
        <Layout>
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Lab Order Details</h1>
                <p className="text-gray-500">Order ID: {params.id}</p>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500">Result entry and barcode tracking functionality will be displayed here.</p>
                </div>
            </div>
        </Layout>
    );
}
