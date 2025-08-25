import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../utils/apiService';

const PurchaseOrderForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    order_no: '',
    order_date: new Date().toISOString().split('T')[0],
    customer: '',
    broker: '',
    mill: '',
    weight: '',
    bags: '',
    product: '',
    rate: '',
    terms_conditions: ''
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchOrder = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const response = await apiService.getOrder(id);
          
          // Format date for input field
          const orderData = response.data;
          orderData.order_date = new Date(orderData.order_date).toISOString().split('T')[0];
          
          setFormData(orderData);
          setError(null);
        } catch (err) {
          console.error('Error fetching purchase order:', err);
          setError('Failed to load purchase order details');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchOrder();
  }, [id, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      if (isEditMode) {
        await apiService.updateOrder(id, formData);
      } else {
        await apiService.createOrder(formData);
      }
      
      navigate('/purchase-orders');
    } catch (err) {
      console.error('Error saving purchase order:', err);
      setError(err.response?.data?.message || 'Failed to save purchase order');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="text-gray-600">Loading purchase order details...</div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {isEditMode ? 'Edit Purchase Order' : 'Create Purchase Order'}
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {isEditMode
                ? 'Update the details of the purchase order.'
                : 'Fill in the details to create a new purchase order.'}
            </p>
          </div>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                <div className="grid grid-cols-6 gap-6">
                  {/* Order No */}
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="order_no" className="block text-sm font-medium text-gray-700">
                      Order No.
                    </label>
                    <input
                      type="text"
                      name="order_no"
                      id="order_no"
                      required
                      value={formData.order_no}
                      onChange={handleChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Order Date */}
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="order_date" className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      name="order_date"
                      id="order_date"
                      required
                      value={formData.order_date}
                      onChange={handleChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Customer */}
                  <div className="col-span-6">
                    <label htmlFor="customer" className="block text-sm font-medium text-gray-700">
                      Customer
                    </label>
                    <input
                      type="text"
                      name="customer"
                      id="customer"
                      required
                      value={formData.customer}
                      onChange={handleChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Broker */}
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="broker" className="block text-sm font-medium text-gray-700">
                      Broker
                    </label>
                    <input
                      type="text"
                      name="broker"
                      id="broker"
                      value={formData.broker || ''}
                      onChange={handleChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Mill */}
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="mill" className="block text-sm font-medium text-gray-700">
                      Mill
                    </label>
                    <input
                      type="text"
                      name="mill"
                      id="mill"
                      value={formData.mill || ''}
                      onChange={handleChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Product */}
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="product" className="block text-sm font-medium text-gray-700">
                      Product
                    </label>
                    <input
                      type="text"
                      name="product"
                      id="product"
                      value={formData.product || ''}
                      onChange={handleChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Weight */}
                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      id="weight"
                      step="0.01"
                      min="0"
                      value={formData.weight || ''}
                      onChange={handleChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Bags */}
                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                    <label htmlFor="bags" className="block text-sm font-medium text-gray-700">
                      Bags
                    </label>
                    <input
                      type="number"
                      name="bags"
                      id="bags"
                      min="0"
                      value={formData.bags || ''}
                      onChange={handleChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Rate */}
                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                    <label htmlFor="rate" className="block text-sm font-medium text-gray-700">
                      Rate
                    </label>
                    <input
                      type="number"
                      name="rate"
                      id="rate"
                      step="0.01"
                      min="0"
                      value={formData.rate || ''}
                      onChange={handleChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Value */}
                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                    <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                      Value (₹)
                    </label>
                    <input
                      type="number"
                      name="value"
                      id="value"
                      step="0.01"
                      min="0"
                      value={formData.value || ''}
                      onChange={handleChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Terms & Conditions */}
                  <div className="col-span-6">
                    <label htmlFor="terms_conditions" className="block text-sm font-medium text-gray-700">
                      Terms & Conditions
                    </label>
                    <textarea
                      name="terms_conditions"
                      id="terms_conditions"
                      rows={4}
                      value={formData.terms_conditions || ''}
                      onChange={handleChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="button"
                  onClick={() => navigate('/purchase-orders')}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {submitting ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderForm;
