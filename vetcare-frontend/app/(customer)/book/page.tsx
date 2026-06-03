import Layout from '@/components/shared/Layout';

export default function BookPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>

        <div className="bg-white p-6 rounded-lg shadow">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Pet</label>
              <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="">Choose a pet...</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Select Branch</label>
              <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="">Choose a location...</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Select Vet</label>
              <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="">Choose a vet...</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Time Slot</label>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'].map(
                  (slot) => (
                    <button
                      key={slot}
                      type="button"
                      className="py-2 px-3 text-sm border rounded hover:bg-primary-50 hover:border-primary-300"
                    >
                      {slot}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Any additional notes..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Book Appointment
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
