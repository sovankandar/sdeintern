"use client"
import { X, Download } from "lucide-react"

const QRCodeModal = ({ qrCode, onClose }) => {
  const handleDownload = () => {
    // Create a temporary link element
    const link = document.createElement("a")
    link.href = qrCode
    link.download = "qrcode.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="h-6 w-6" />
        </button>

        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">QR Code</h3>

        <div className="flex justify-center mb-6">
          <div className="p-4 bg-white rounded-lg shadow-inner">
            <img
              src={qrCode || "/placeholder.svg?height=200&width=200"}
              alt="QR Code"
              className="w-48 h-48 object-contain"
            />
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="w-full flex justify-center items-center py-2 px-4 rounded-lg font-medium text-white bg-rose-500 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors"
        >
          <Download className="h-5 w-5 mr-2" />
          Download QR Code
        </button>
      </div>
    </div>
  )
}

export default QRCodeModal
