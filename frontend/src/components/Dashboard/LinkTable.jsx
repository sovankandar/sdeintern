"use client"

import { useState } from "react"
import { format } from "date-fns"
import QRCodeModal from "./QRCodeModal"
import axios from "axios"
import { Search, ChevronLeft, ChevronRight, ExternalLink, QrCode } from "lucide-react"

const LinkTable = ({ links, loading }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedQR, setSelectedQR] = useState(null)
  const itemsPerPage = 10

  const filteredLinks = links.filter(
    (link) =>
      link.originalUrl?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.shortUrl?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentLinks = filteredLinks.slice(indexOfFirstItem, indexOfLastItem)

  // Use environment variable from Next.js public runtime config
  const apiUrl = typeof window !== "undefined" ? window.location.origin : ""

  const handleShortUrlClick = async (e, link) => {
    e.preventDefault()
    try {
      // Track click before redirecting
      await axios.post(`http://localhost:5000/api/links/${link.shortUrl}/click`, {
        deviceType: navigator.userAgent,
        timestamp: new Date(),
      })

      // Redirect to original URL
      window.open(link.originalUrl, "_blank")
    } catch (error) {
      console.error("Error tracking click:", error)
      window.open(link.originalUrl, "_blank")
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Your Links</h2>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search links..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Original URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Short URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Clicks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentLinks.length > 0 ? (
                currentLinks.map((link) => (
                  <tr key={link._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100 truncate max-w-xs">
                        {link.originalUrl}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href="#"
                        onClick={(e) => handleShortUrlClick(e, link)}
                        className="text-sm text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300 flex items-center"
                      >
                        {link.shortUrl}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{link.clicks || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {link.createdAt ? format(new Date(link.createdAt), "MMM dd, yyyy") : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {link.expirationDate && new Date(link.expirationDate) < new Date() ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          Expired
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedQR(link.qrCode)}
                        className="text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300 flex items-center"
                      >
                        <QrCode className="h-4 w-4 mr-1" />
                        QR Code
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    No links found. Create your first short link above!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedQR && <QRCodeModal qrCode={selectedQR} onClose={() => setSelectedQR(null)} />}

      {filteredLinks.length > itemsPerPage && (
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-200">
            Page {currentPage} of {Math.ceil(filteredLinks.length / itemsPerPage)}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={indexOfLastItem >= filteredLinks.length}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      )}
    </div>
  )
}

export default LinkTable
