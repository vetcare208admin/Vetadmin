import Layout from '@/components/shared/Layout';

export default function AppointmentsPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <a href="/book" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
            Book New
          </a>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 text-center text-gray-500">
            <p>No appointments yet.</p>
            <a href="/book" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
              Book your first appointment →
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
