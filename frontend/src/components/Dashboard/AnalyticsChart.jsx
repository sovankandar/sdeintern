"use client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{`Date: ${label}`}</p>
        <div className="flex items-center mt-2">
          <div className="w-3 h-3 rounded-full bg-rose-500 mr-2"></div>
          <p className="text-rose-500 font-bold">{`${payload[0].value} clicks`}</p>
        </div>
      </div>
    )
  }

  return null
}

const AnalyticsChart = ({ data }) => {
  // Transform the links data for the chart
  const chartData = data.map((link) => ({
    name: link.createdAt ? new Date(link.createdAt).toLocaleDateString() : "Unknown",
    clicks: link.clicks || 0,
  }))

  // Aggregate data by date (sum clicks for the same date)
  const aggregatedData = chartData.reduce((acc, item) => {
    const existingItem = acc.find((i) => i.name === item.name)
    if (existingItem) {
      existingItem.clicks += item.clicks
    } else {
      acc.push(item)
    }
    return acc
  }, [])

  // Sort by date
  aggregatedData.sort((a, b) => new Date(a.name) - new Date(b.name))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border flex flex-col justify-center items-center border-gray-100 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
        <TrendingUp className="mr-2 h-5 w-5 text-rose-500" />
        Click Analytics
      </h2>

      {aggregatedData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={aggregatedData}>
            <defs>
              <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#6b7280" }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis tick={{ fill: "#6b7280" }} axisLine={{ stroke: "#e5e7eb" }} tickLine={{ stroke: "#e5e7eb" }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="clicks"
              name="Clicks"
              stroke="#f43f5e"
              strokeWidth={3}
              dot={{ fill: "#f43f5e", r: 6 }}
              activeDot={{ r: 8, stroke: "#f43f5e", strokeWidth: 2 }}
              fillOpacity={1}
              fill="url(#colorClicks)"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-gray-500 dark:text-gray-400 text-center">
            No data available yet. Create and share some links to see analytics!
          </p>
        </div>
      )}
    </div>
  )
}

export default AnalyticsChart
