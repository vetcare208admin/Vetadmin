import Layout from '@/components/shared/Layout';

export default function InvoicesPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 text-center text-gray-500">
            <p>No invoices yet.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
