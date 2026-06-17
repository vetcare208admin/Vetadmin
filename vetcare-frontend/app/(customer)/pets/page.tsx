import Layout from '@/components/shared/Layout';

export default function PetsPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Pets</h1>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
            Add Pet
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 text-center text-gray-500">
            <p>No pets added yet.</p>
            <button className="text-primary-600 hover:text-primary-700 mt-2">
              Add your first pet →
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
