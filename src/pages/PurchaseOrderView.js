import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiService from '../utils/apiService';
import { Helmet } from 'react-helmet';

const PurchaseOrderView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch order
        const orderResponse = await apiService.getOrder(id);
        setOrder(orderResponse.data);
        
        // Fetch company profile for PDF generation
        try {
          const profileResponse = await apiService.getCompanyProfile();
          setCompanyProfile(profileResponse.data);
        } catch (profileError) {
          console.log('Company profile not set yet');
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching purchase order:', err);
        setError('Failed to load purchase order details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // Function to handle printing the current page
  const handlePrint = () => {
    window.print();
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await apiService.deleteOrder(id);
        navigate('/purchase-orders');
      } catch (err) {
        console.error('Error deleting order:', err);
        alert('Failed to delete order');
      }
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="text-gray-600">Loading purchase order details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate('/purchase-orders')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Purchase Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Purchase order not found</h3>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate('/purchase-orders')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Purchase Orders
          </button>
        </div>
      </div>
    );
  }

  const apiBaseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style type="text/css">
          {`
            @media print {
              body * {
                visibility: hidden;
              }
              .print-section, .print-section * {
                visibility: visible;
              }
              .print-section {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
              }
              .no-print {
                display: none !important;
              }
            }
          `}
        </style>
      </Helmet>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Purchase Order</h1>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-3">
          <Link
            to="/purchase-orders"
            className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </Link>
          <div className="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto">
            <Link
              to={`/purchase-orders/${id}`}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit
            </Link>
            <button
              onClick={handlePrint}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 no-print"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
              </svg>
              Print
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 no-print"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-8 print-section">
        {/* Company Header similar to PDF */}
        <div className="flex flex-col items-center mb-8">
          {companyProfile?.logo_path && (
            <div className="mb-4">
              <img 
                src={`${apiBaseUrl}${companyProfile.logo_path}`}
                alt={companyProfile.company_name || 'Company Logo'} 
                className="h-20 object-contain"
              />
            </div>
          )}
          
          {companyProfile?.company_name && (
            <h1 className="text-2xl font-bold text-blue-900 mb-2">
              {companyProfile.company_name}
            </h1>
          )}
          
          {companyProfile?.address && (
            <div className="text-center text-sm mb-1">
              {companyProfile.address.split('\\n').map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          )}
          
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {companyProfile?.mobile && <p>Mobile: {companyProfile.mobile}</p>}
            {companyProfile?.email && <p>Email: {companyProfile.email}</p>}
            {companyProfile?.gst_number && <p>GST: {companyProfile.gst_number}</p>}
          </div>
        </div>
        
        {/* Order Title */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold uppercase">Purchase Order</h2>
        </div>
        
        {/* Order Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <p><span className="font-medium">Order Number:</span> {order.order_no}</p>
            <p><span className="font-medium">Date:</span> {new Date(order.order_date).toLocaleDateString()}</p>
          </div>
          <div>
            <p><span className="font-medium">Customer:</span> {order.customer}</p>
            <p><span className="font-medium">Broker:</span> {order.broker || 'N/A'}</p>
            <p><span className="font-medium">Mill:</span> {order.mill || 'N/A'}</p>
          </div>
        </div>
        
        {/* Order Details Table */}
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Product</th>
                <th className="py-2 px-4 border-b text-left">Weight</th>
                <th className="py-2 px-4 border-b text-left">Bags</th>
                <th className="py-2 px-4 border-b text-left">Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b">{order.product || 'N/A'}</td>
                <td className="py-2 px-4 border-b">{order.weight ? `${order.weight} kg` : 'N/A'}</td>
                <td className="py-2 px-4 border-b">{order.bags || 'N/A'}</td>
                <td className="py-2 px-4 border-b">{order.rate ? `₹${order.rate}` : 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Terms and Conditions */}
        {order.terms_conditions && (
          <div className="mb-8">
            <h3 className="font-medium mb-2">Terms & Conditions:</h3>
            <p className="whitespace-pre-wrap text-sm">{order.terms_conditions}</p>
          </div>
        )}
        
        {/* Bank Details */}
        {companyProfile?.bank_details && (
          <div className="mb-8">
            <h3 className="font-medium mb-2">Bank Details:</h3>
            <p className="whitespace-pre-wrap text-sm">{companyProfile.bank_details}</p>
          </div>
        )}
        
        {/* Signature Line */}
        <div className="flex justify-end mt-12">
          <div className="text-center">
            <div className="w-48 border-t border-gray-400"></div>
            <p className="mt-1">Authorized Signatory</p>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-gray-500">
        <p>Created on {new Date(order.created_at).toLocaleDateString()} by {order.created_by_username || 'Unknown'}</p>
      </div>
    </div>
  );
};

export default PurchaseOrderView;
