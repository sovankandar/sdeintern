"use client";

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createLink } from '../../features/links/linkSlice';
import { LinkIcon, CalendarIcon } from 'lucide-react';

const CreateLink = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    originalUrl: '',
    alias: '',
    expirationDate: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(createLink(formData)).unwrap();
      setFormData({ originalUrl: '', alias: '', expirationDate: '' });
    } catch (error) {
      console.error('Failed to create link:', error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-all hover:shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
        <LinkIcon className="mr-2 h-6 w-6 text-rose-500" />
        Create New Short Link
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Original URL
          </label>
          <div className="relative">
            <input
              type="url"
              name="originalUrl"
              required
              value={formData.originalUrl}
              onChange={handleChange}
              placeholder="https://example.com/very-long-url"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Custom Alias (optional)
          </label>
          <div className="relative">
            <input
              type="text"
              name="alias"
              value={formData.alias}
              onChange={handleChange}
              placeholder="my-custom-link"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
              Expiration Date (optional)
            </div>
          </label>
          <input
            type="datetime-local"
            name="expirationDate"
            value={formData.expirationDate}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-3 px-4 rounded-lg font-medium text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 shadow-md hover:shadow-lg transition-all disabled:opacity-70"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </>
          ) : (
            'Create Short Link'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateLink;
