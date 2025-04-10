"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import CreateLink from "../LinkShortener/CreateLink"
import LinkTable from "./LinkTable"
import AnalyticsChart from "./AnalyticsChart"
import DeviceBreakdownChart from "./DeviceBreakDownChart"
import { fetchLinks } from "../../features/links/linkSlice"
import { Link2, BarChart2 } from "lucide-react"
import ThemeToggle from "../Theme-Toggle"

const Dashboard = () => {
  const dispatch = useDispatch()
  const { links, loading } = useSelector((state) => state.links || { links: [], loading: false })
  const [selectedLinkId, setSelectedLinkId] = useState(null)

  useEffect(() => {
    dispatch(fetchLinks())
  }, [dispatch])

  // Add this useEffect to monitor the links data
  useEffect(() => {
    console.log("Links data:", links)
  }, [links])

  useEffect(() => {
    if (links && links.length > 0 && !selectedLinkId) {
      setSelectedLinkId(links[0]._id)
    }
  }, [links, selectedLinkId])

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white flex items-center">
            <Link2 className="mr-3 h-8 w-8 text-rose-500" />
            URL Shortener Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200">
              <BarChart2 className="h-4 w-4 mr-1" />
              Analytics
            </span>
            <ThemeToggle />
          </div>
        </div>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Create, manage, and track your shortened URLs in one place
        </p>
      </header>

      <div className="mb-8">
        <CreateLink />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Add loading and error handling */}
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <p className="text-gray-500 dark:text-gray-400">Loading analytics...</p>
          </div>
        ) : links && links.length > 0 ? (
          <AnalyticsChart data={links} />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <p className="text-gray-500 dark:text-gray-400">No data available</p>
          </div>
        )}

        {selectedLinkId && (
          <div>
            <div className="mb-4">
              <select
                value={selectedLinkId}
                onChange={(e) => setSelectedLinkId(e.target.value)}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {links.map((link) => (
                  <option key={link._id} value={link._id}>
                    {link.shortUrl}
                  </option>
                ))}
              </select>
            </div>
            <DeviceBreakdownChart linkId={selectedLinkId} />
          </div>
        )}
      </div>

      <LinkTable links={links || []} loading={loading} />
    </div>
  )
}

export default Dashboard
