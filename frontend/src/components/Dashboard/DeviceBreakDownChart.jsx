"use client"
import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Smartphone, Laptop, Tablet, Globe, Monitor } from "lucide-react"

// Custom tooltip component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload

    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-800 dark:text-white font-medium">{data.name}</p>
        <div className="flex items-center mt-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.fill }}></div>
          <p className="ml-2 text-gray-600 dark:text-gray-300">{`${data.value} clicks (${data.percentage}%)`}</p>
        </div>
      </div>
    )
  }

  return null
}

// Custom legend component
const CustomLegend = ({ payload }) => {
  return (
    <ul className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">{entry.value}</span>
        </li>
      ))}
    </ul>
  )
}

// Tab component for switching between different charts
const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
    }`}
  >
    {children}
  </button>
)

const DeviceBreakdownChart = ({ linkId }) => {
  const [analyticsData, setAnalyticsData] = useState([])
  const [browserData, setBrowserData] = useState([])
  const [osData, setOsData] = useState([])
  const [timeData, setTimeData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("device")

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem("token")

        const response = await fetch(`http://localhost:5000/api/analytics/${linkId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch analytics data")
        }
        const data = await response.json()
        // Log the response to see the structure
        console.log("Analytics response:", data)
        setAnalyticsData(data.deviceStats || [])
        setBrowserData(data.browserStats || [])
        setOsData(data.osStats || [])
        setTimeData(data.timeStats || [])
      } catch (err) {
        setError(err.message)
        console.error("Error fetching analytics:", err)
      } finally {
        setIsLoading(false)
      }
    }

    if (linkId) {
      fetchAnalytics()
    }
  }, [linkId])

  // Transform the device analytics data
  const deviceData = [
    {
      name: "Mobile",
      value: analyticsData.find((item) => item._id === "mobile")?.count || 0,
      fill: "#f43f5e",
      icon: Smartphone,
    },
    {
      name: "Desktop",
      value: analyticsData.find((item) => item._id === "desktop")?.count || 0,
      fill: "#8b5cf6",
      icon: Laptop,
    },
    {
      name: "Tablet",
      value: analyticsData.find((item) => item._id === "tablet")?.count || 0,
      fill: "#10b981",
      icon: Tablet,
    },
  ]

  // Transform browser data
  const browserColors = {
    Chrome: "#4285F4",
    Firefox: "#FF7139",
    Safari: "#0FB5EE",
    Edge: "#0078D7",
    Opera: "#FF1B2D",
    Other: "#888888",
  }

  const transformedBrowserData = browserData.map((item) => ({
    name: item._id,
    value: item.count,
    fill: browserColors[item._id] || "#888888",
    icon: Globe,
  }))

  // Transform OS data
  const osColors = {
    Windows: "#0078D7",
    macOS: "#999999",
    iOS: "#A2AAAD",
    Android: "#3DDC84",
    Linux: "#FCC624",
    Other: "#888888",
  }

  const transformedOsData = osData.map((item) => ({
    name: item._id,
    value: item.count,
    fill: osColors[item._id] || "#888888",
    icon: Monitor,
  }))

  // Calculate percentages for the active dataset
  const getDataWithPercentage = (data) => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    return data.map((item) => ({
      ...item,
      percentage: total > 0 ? Math.round((item.value / total) * 100) : 0,
    }))
  }

  // Get the active dataset based on the selected tab
  const getActiveData = () => {
    switch (activeTab) {
      case "device":
        return getDataWithPercentage(deviceData)
      case "browser":
        return getDataWithPercentage(transformedBrowserData)
      case "os":
        return getDataWithPercentage(transformedOsData)
      default:
        return getDataWithPercentage(deviceData)
    }
  }

  const activeData = getActiveData()
  const total = activeData.reduce((sum, item) => sum + item.value, 0)

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Visitor Analytics</h2>

      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        <TabButton active={activeTab === "device"} onClick={() => setActiveTab("device")}>
          Devices
        </TabButton>
        <TabButton active={activeTab === "browser"} onClick={() => setActiveTab("browser")}>
          Browsers
        </TabButton>
        <TabButton active={activeTab === "os"} onClick={() => setActiveTab("os")}>
          Operating Systems
        </TabButton>
        <TabButton active={activeTab === "time"} onClick={() => setActiveTab("time")}>
          Visit Times
        </TabButton>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-red-500 dark:text-red-400 text-center">{error}</p>
        </div>
      ) : activeTab === "time" ? (
        <div className="overflow-auto max-h-96">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Device</th>
                <th className="px-6 py-3">Browser</th>
                <th className="px-6 py-3">OS</th>
              </tr>
            </thead>
            <tbody>
              {timeData.length > 0 ? (
                timeData.map((visit, index) => (
                  <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-6 py-4">{formatTimestamp(visit.timestamp)}</td>
                    <td className="px-6 py-4">{visit.deviceType}</td>
                    <td className="px-6 py-4">{visit.browserType}</td>
                    <td className="px-6 py-4">{visit.osType}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No visit data available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : total > 0 ? (
        <>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {activeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {activeData.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="flex flex-col items-center">
                  <div className="p-3 rounded-full" style={{ backgroundColor: `${item.fill}20` }}>
                    <Icon className="h-6 w-6" style={{ color: item.fill }} />
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">{item.name}</p>
                  <p className="text-lg font-bold" style={{ color: item.fill }}>
                    {item.percentage}%
                  </p>
                  <p className="text-sm text-gray-500">({item.value} visits)</p>
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-gray-500 dark:text-gray-400 text-center">No {activeTab} data available yet.</p>
        </div>
      )}
    </div>
  )
}

export default DeviceBreakdownChart
