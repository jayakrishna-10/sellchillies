export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="spinner mb-4"></div>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Loading SellChillies</h2>
        <p className="text-gray-500">Please wait while we load your business data...</p>
      </div>
    </div>
  )
}
