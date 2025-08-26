import React, { useState, useEffect } from 'react';
import apiService from '../utils/apiService';

const CompanyProfile = () => {
  const [formData, setFormData] = useState({
    company_name: '',
    address: '',
    mobile: '',
    email: '',
    gst_number: '',
    bank_details: ''
  });
  
  const [logo, setLogo] = useState(null);
  const [previewLogo, setPreviewLogo] = useState('');
  const [existingLogo, setExistingLogo] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        setLoading(true);
        const response = await apiService.getCompanyProfile();
        setFormData(response.data);
        
        if (response.data.logo_path) {
          const apiBaseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
          setExistingLogo(`${apiBaseUrl}${response.data.logo_path}`);
        }
        
        setError(null);
      } catch (err) {
        if (err.response?.status === 404) {
          // No profile found yet, that's okay
          console.log('No company profile found yet');
        } else {
          console.error('Error fetching company profile:', err);
          setError('Failed to load company profile');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompanyProfile();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogo(file);
      
      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    
    try {
      const formDataObj = new FormData();
      
      // Append text fields
      Object.keys(formData).forEach((key) => {
        formDataObj.append(key, formData[key] || '');
      });
      
      // Append logo if new one selected
      if (logo) {
        formDataObj.append('logo', logo);
      }
      
      await apiService.updateCompanyProfile(formDataObj);
      
      setSuccess(true);
      
      // Scroll to top to show success message
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('Error saving company profile:', err);
      setError(err.response?.data?.message || 'Failed to save company profile');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="text-gray-600">Loading company profile...</div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Data isolation notice */}
      <div className="mb-6 bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              <strong>Your Private Company Profile:</strong> This information appears only on <strong>your</strong> purchase orders. 
              Each user has their own separate company profile that cannot be seen by other users.
            </p>
          </div>
        </div>
      </div>
      
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Company Profile</h3>
            <p className="mt-1 text-sm text-gray-600">
              Update your company details that will appear on the PDF bills.
            </p>
          </div>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
              Company profile updated successfully!
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                {/* Logo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Logo</label>
                  <div className="mt-1 flex items-center">
                    {(previewLogo || existingLogo) && (
                      <div className="mr-3 h-32 w-32 overflow-hidden rounded-md border-2 border-gray-300">
                        <img
                          src={previewLogo || existingLogo}
                          alt="Logo preview"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        id="logo"
                        className="hidden"
                        onChange={handleLogoChange}
                      />
                      <label
                        htmlFor="logo"
                        className="cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {existingLogo || previewLogo ? 'Change logo' : 'Upload logo'}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    id="company_name"
                    required
                    value={formData.company_name}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    name="address"
                    id="address"
                    rows={3}
                    value={formData.address || ''}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Street, City, State, Pincode"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Use line breaks for a multi-line address as it will appear on the PDF.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Mobile */}
                  <div>
                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      name="mobile"
                      id="mobile"
                      value={formData.mobile || ''}
                      onChange={handleChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* GST Number */}
                <div>
                  <label htmlFor="gst_number" className="block text-sm font-medium text-gray-700">
                    GST Number
                  </label>
                  <input
                    type="text"
                    name="gst_number"
                    id="gst_number"
                    value={formData.gst_number || ''}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                {/* Bank Details */}
                <div>
                  <label htmlFor="bank_details" className="block text-sm font-medium text-gray-700">
                    Bank Details
                  </label>
                  <textarea
                    name="bank_details"
                    id="bank_details"
                    rows={4}
                    value={formData.bank_details || ''}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Bank Name, Account Number, IFSC Code, Branch"
                  />
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {submitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
