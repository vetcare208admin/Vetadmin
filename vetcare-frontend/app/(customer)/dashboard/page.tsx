import Layout from '@/components/shared/Layout';

export default function DashboardPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Upcoming Appointments</h3>
            <p className="mt-2 text-3xl font-bold text-primary-600">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">My Pets</h3>
            <p className="mt-2 text-3xl font-bold text-primary-600">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Unpaid Invoices</h3>
            <p className="mt-2 text-3xl font-bold text-primary-600">$0</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/book"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-primary-50 hover:border-primary-200 transition"
            >
              <span className="text-2xl mr-3">📅</span>
              <div>
                <p className="font-medium text-gray-900">Book Appointment</p>
                <p className="text-sm text-gray-500">Schedule a visit</p>
              </div>
            </a>
            <a
              href="/pets"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-primary-50 hover:border-primary-200 transition"
            >
              <span className="text-2xl mr-3">🐕</span>
              <div>
                <p className="font-medium text-gray-900">Manage Pets</p>
                <p className="text-sm text-gray-500">View and edit pet profiles</p>
              </div>
            </a>
            <a
              href="/invoices"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-primary-50 hover:border-primary-200 transition"
            >
              <span className="text-2xl mr-3">💳</span>
              <div>
                <p className="font-medium text-gray-900">View Invoices</p>
                <p className="text-sm text-gray-500">Pay bills online</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
