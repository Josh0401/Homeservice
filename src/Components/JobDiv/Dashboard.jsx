import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="pageHeader flex flex-col items-center justify-center py-10 bg-greyIsh">
        <h1 className="text-[32px] text-textColor font-bold mb-4">My Dashboard</h1>
        <p className="text-[16px] text-[#959595] max-w-[600px] text-center">
          Welcome back, {user?.name || 'User'}! Manage your bookings, settings, and preferences here.
        </p>
      </div>

      <div className="py-12 px-4">
        <div className="max-w-[1200px] mx-auto">
          {/* Dashboard content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stats Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-[#e7e7e7]">
              <h2 className="text-xl font-bold mb-4 text-blueColor">Activity Summary</h2>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center pb-2 border-b border-[#e7e7e7]">
                  <span className="text-[#6f6f6f]">Pending Appointments</span>
                  <span className="font-bold">3</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#e7e7e7]">
                  <span className="text-[#6f6f6f]">Completed Services</span>
                  <span className="font-bold">12</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-[#6f6f6f]">Service Providers Saved</span>
                  <span className="font-bold">5</span>
                </div>
              </div>
            </div>

            {/* Recent Bookings Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-[#e7e7e7] md:col-span-2">
              <h2 className="text-xl font-bold mb-4 text-blueColor">Recent Bookings</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e7e7e7]">
                      <th className="text-left pb-3 text-[#6f6f6f]">Service</th>
                      <th className="text-left pb-3 text-[#6f6f6f]">Provider</th>
                      <th className="text-left pb-3 text-[#6f6f6f]">Date</th>
                      <th className="text-left pb-3 text-[#6f6f6f]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#e7e7e7]">
                      <td className="py-3">Home Cleaning</td>
                      <td className="py-3">CleanCo Services</td>
                      <td className="py-3">Mar 10, 2025</td>
                      <td className="py-3">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Completed</span>
                      </td>
                    </tr>
                    <tr className="border-b border-[#e7e7e7]">
                      <td className="py-3">Plumbing Repair</td>
                      <td className="py-3">Fix-It Plumbing</td>
                      <td className="py-3">Mar 14, 2025</td>
                      <td className="py-3">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">Scheduled</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3">Lawn Maintenance</td>
                      <td className="py-3">Green Thumb Landscaping</td>
                      <td className="py-3">Mar 18, 2025</td>
                      <td className="py-3">
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">Pending</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <a href="/booking" className="text-blueColor hover:underline text-sm">View all bookings →</a>
              </div>
            </div>

            {/* Recommended Services */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-[#e7e7e7] md:col-span-3">
              <h2 className="text-xl font-bold mb-4 text-blueColor">Recommended For You</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-[#e7e7e7] rounded-lg hover:shadow-md transition-all">
                  <h3 className="font-bold mb-2">Seasonal HVAC Maintenance</h3>
                  <p className="text-[#6f6f6f] text-sm mb-3">Get your HVAC system checked before summer to ensure optimal performance.</p>
                  <button className="text-blueColor hover:underline text-sm">View providers</button>
                </div>
                <div className="p-4 border border-[#e7e7e7] rounded-lg hover:shadow-md transition-all">
                  <h3 className="font-bold mb-2">Carpet Deep Cleaning</h3>
                  <p className="text-[#6f6f6f] text-sm mb-3">Professional cleaning services to remove deep stains and allergens.</p>
                  <button className="text-blueColor hover:underline text-sm">View providers</button>
                </div>
                <div className="p-4 border border-[#e7e7e7] rounded-lg hover:shadow-md transition-all">
                  <h3 className="font-bold mb-2">Gutter Cleaning</h3>
                  <p className="text-[#6f6f6f] text-sm mb-3">Prevent water damage with our professional gutter cleaning services.</p>
                  <button className="text-blueColor hover:underline text-sm">View providers</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;