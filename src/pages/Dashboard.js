import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../utils/apiService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get purchase orders
        const ordersResponse = await apiService.getOrders();
        const orders = ordersResponse.data;
        
        // Set dashboard stats
        setStats({
          totalOrders: orders.length,
          recentOrders: orders.slice(0, 5) // Get 5 most recent orders
        });
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="text-gray-600">Loading dashboard data...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <div className="mt-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Stats card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Purchase Orders</dt>
                    <dd className="text-3xl font-semibold text-gray-900">{stats.totalOrders}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <Link to="/purchase-orders" className="font-medium text-indigo-600 hover:text-indigo-500">
                  View all orders
                </Link>
              </div>
            </div>
          </div>

          {/* Action card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">New Purchase Order</h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>Create a new purchase order in the system.</p>
              </div>
              <div className="mt-5">
                <Link
                  to="/purchase-orders/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create Order
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Purchase Orders</h2>
        
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order) => (
                <li key={order.id}>
                  <Link to={`/purchase-orders/${order.id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="sm:flex">
                          <p className="text-sm font-medium text-indigo-600 truncate">Order #{order.order_no}</p>
                          <p className="mt-1 sm:mt-0 sm:ml-6 text-sm text-gray-500">
                            <span className="font-medium text-gray-900">Date:</span> {new Date(order.order_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {order.customer}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <span className="truncate">Product: {order.product}</span>
                          </p>
                          <p className="mt-1 sm:mt-0 sm:ml-6 flex items-center text-sm text-gray-500">
                            <span>Amount: ₹{(order.weight * order.rate).toFixed(2)}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <li className="px-4 py-4 sm:px-6 text-sm text-gray-500">No purchase orders found.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
