import React from 'react'
import { Plus, TrendingUp, Calendar } from 'lucide-react'
import { format } from 'date-fns'

export default function RecoveriesTab({ 
  customers, 
  recoveries, 
  newRecovery, 
  setNewRecovery, 
  addRecovery 
}) {
  const totalRecoveries = recoveries.reduce((sum, recovery) => sum + parseFloat(recovery.amount), 0)
  const todaysRecoveries = recoveries.filter(recovery => 
    format(new Date(recovery.recovery_date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  )
  const todaysTotal = todaysRecoveries.reduce((sum, recovery) => sum + parseFloat(recovery.amount), 0)

  // Group recoveries by month for summary
  const monthlyRecoveries = recoveries.reduce((acc, recovery) => {
    const month = format(new Date(recovery.recovery_date), 'yyyy-MM')
    if (!acc[month]) acc[month] = 0
    acc[month] += parseFloat(recovery.amount)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Recovery Management</h2>
        <div className="text-sm text-gray-600">
          Today's Recoveries: <span className="font-bold text-green-600">₹{todaysTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Recovery Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Recoveries</p>
              <p className="text-2xl font-bold text-gray-800">₹{totalRecoveries.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Today's Recoveries</p>
              <p className="text-2xl font-bold text-gray-800">{todaysRecoveries.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <Plus className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-800">{recoveries.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Recovery Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Recovery</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={newRecovery.customer_id}
            onChange={(e) => setNewRecovery({...newRecovery, customer_id: e.target.value})}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          >
            <option value="">Select Customer</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>{customer.name}</option>
            ))}
          </select>
          <input
            type="number"
            step="0.01"
            placeholder="Recovery Amount (₹)"
            value={newRecovery.amount}
            onChange={(e) => setNewRecovery({...newRecovery, amount: e.target.value})}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
          <input
            type="date"
            value={newRecovery.recovery_date}
            onChange={(e) => setNewRecovery({...newRecovery, recovery_date: e.target.value})}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>
        
        {/* Recovery Preview */}
        {newRecovery.amount && newRecovery.customer_id && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Recovery Preview:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Customer:</p>
                <p className="font-medium">{customers.find(c => c.id === newRecovery.customer_id)?.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Amount:</p>
                <p className="font-medium text-green-600">₹{parseFloat(newRecovery.amount || 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">Date:</p>
                <p className="font-medium">{format(new Date(newRecovery.recovery_date), 'MMM dd, yyyy')}</p>
              </div>
            </div>
          </div>
        )}
        
        <button
          onClick={addRecovery}
          disabled={!newRecovery.customer_id || !newRecovery.amount}
          className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Recovery
        </button>
      </div>

      {/* Recoveries List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Recovery History ({recoveries.length})</h3>
        
        {recoveries.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No recoveries found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Customer</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Recovery Date</th>
                  <th className="text-left p-2">Added On</th>
                  <th className="text-left p-2">Days Ago</th>
                </tr>
              </thead>
              <tbody>
                {recoveries.slice().reverse().map(recovery => {
                  const daysAgo = Math.floor((new Date() - new Date(recovery.recovery_date)) / (1000 * 60 * 60 * 24))
                  const isToday = daysAgo === 0
                  
                  return (
                    <tr key={recovery.id} className={`border-b hover:bg-gray-50 ${isToday ? 'bg-green-50' : ''}`}>
                      <td className="p-2 font-medium">{recovery.customers?.name || 'Unknown'}</td>
                      <td className="p-2 font-medium text-green-600">₹{parseFloat(recovery.amount).toFixed(2)}</td>
                      <td className="p-2">{format(new Date(recovery.recovery_date), 'MMM dd, yyyy')}</td>
                      <td className="p-2">{format(new Date(recovery.created_at), 'MMM dd, yyyy HH:mm')}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          isToday 
                            ? 'bg-green-100 text-green-800' 
                            : daysAgo <= 7 
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {isToday ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Monthly Summary */}
      {Object.keys(monthlyRecoveries).length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Recovery Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(monthlyRecoveries)
              .sort(([a], [b]) => b.localeCompare(a))
              .slice(0, 12)
              .map(([month, amount]) => (
                <div key={month} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">{format(new Date(month + '-01'), 'MMM yyyy')}</p>
                  <p className="text-lg font-bold text-green-600">₹{amount.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">
                    {recoveries.filter(r => format(new Date(r.recovery_date), 'yyyy-MM') === month).length} transactions
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
