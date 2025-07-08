import React from 'react'
import { Plus, Package, TrendingUp, DollarSign } from 'lucide-react'
import { format } from 'date-fns'

export default function ChilliesTab({ 
  customers, 
  chillieTransactions, 
  newChillieTransaction, 
  setNewChillieTransaction, 
  addChillieTransaction 
}) {
  const totalCommission = chillieTransactions.reduce((sum, t) => sum + parseFloat(t.commission), 0)
  const totalServiceCharges = chillieTransactions.reduce((sum, t) => sum + parseFloat(t.service_charge), 0)
  const totalChilliesTraded = chillieTransactions.reduce((sum, t) => sum + parseFloat(t.weight_kg), 0)
  const totalBagsTraded = chillieTransactions.reduce((sum, t) => sum + parseInt(t.number_of_bags), 0)
  const totalEarnings = totalCommission + totalServiceCharges

  // Calculate transaction preview
  const calculatePreview = () => {
    if (!newChillieTransaction.number_of_bags || !newChillieTransaction.weight_kg || !newChillieTransaction.market_rate) {
      return null
    }
    
    const bags = parseInt(newChillieTransaction.number_of_bags)
    const weight = parseFloat(newChillieTransaction.weight_kg)
    const rate = parseFloat(newChillieTransaction.market_rate)
    
    const totalEarnings = (weight * rate) + (bags * 45)
    const commission = totalEarnings * 0.02
    const serviceCharge = bags * 29
    const totalCharges = commission + serviceCharge
    const netAmount = totalEarnings - totalCharges
    
    return {
      totalEarnings,
      commission,
      serviceCharge,
      totalCharges,
      netAmount
    }
  }

  const preview = calculatePreview()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Chillies Trading</h2>
        <div className="text-sm text-gray-600">
          Total Earnings: <span className="font-bold text-green-600">₹{totalEarnings.toFixed(2)}</span>
        </div>
      </div>

      {/* Trading Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Weight Traded</p>
              <p className="text-2xl font-bold text-gray-800">{totalChilliesTraded.toFixed(2)} kg</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Bags</p>
              <p className="text-2xl font-bold text-gray-800">{totalBagsTraded}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Commission</p>
              <p className="text-2xl font-bold text-gray-800">₹{totalCommission.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Service Charges</p>
              <p className="text-2xl font-bold text-gray-800">₹{totalServiceCharges.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Transaction Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Chillies Transaction</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <select
            value={newChillieTransaction.customer_id}
            onChange={(e) => setNewChillieTransaction({...newChillieTransaction, customer_id: e.target.value})}
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
            placeholder="Number of Bags"
            value={newChillieTransaction.number_of_bags}
            onChange={(e) => setNewChillieTransaction({...newChillieTransaction, number_of_bags: e.target.value})}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Weight (kg)"
            value={newChillieTransaction.weight_kg}
            onChange={(e) => setNewChillieTransaction({...newChillieTransaction, weight_kg: e.target.value})}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Market Rate (₹/kg)"
            value={newChillieTransaction.market_rate}
            onChange={(e) => setNewChillieTransaction({...newChillieTransaction, market_rate: e.target.value})}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
          <input
            type="date"
            value={newChillieTransaction.transaction_date}
            onChange={(e) => setNewChillieTransaction({...newChillieTransaction, transaction_date: e.target.value})}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>
        
        {/* Transaction Preview */}
        {preview && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Transaction Preview:</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Total Earnings:</p>
                <p className="font-medium">₹{preview.totalEarnings.toFixed(2)}</p>
                <p className="text-xs text-gray-500">({newChillieTransaction.weight_kg} × {newChillieTransaction.market_rate}) + ({newChillieTransaction.number_of_bags} × 45)</p>
              </div>
              <div>
                <p className="text-gray-600">Commission (2%):</p>
                <p className="font-medium text-green-600">₹{preview.commission.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Your earnings</p>
              </div>
              <div>
                <p className="text-gray-600">Service Charge:</p>
                <p className="font-medium text-green-600">₹{preview.serviceCharge.toFixed(2)}</p>
                <p className="text-xs text-gray-500">{newChillieTransaction.number_of_bags} × ₹29</p>
              </div>
              <div>
                <p className="text-gray-600">Total Your Earnings:</p>
                <p className="font-medium text-purple-600">₹{preview.totalCharges.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Commission + Service</p>
              </div>
              <div>
                <p className="text-gray-600">Net to Customer:</p>
                <p className="font-medium text-blue-600">₹{preview.netAmount.toFixed(2)}</p>
                <p className="text-xs text-gray-500">After your charges</p>
              </div>
            </div>
          </div>
        )}
        
        <button
          onClick={addChillieTransaction}
          disabled={!newChillieTransaction.customer_id || !newChillieTransaction.number_of_bags || 
                   !newChillieTransaction.weight_kg || !newChillieTransaction.market_rate}
          className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </button>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Transaction History ({chillieTransactions.length})</h3>
        
        {chillieTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No transactions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Customer</th>
                  <th className="text-left p-2">Bags</th>
                  <th className="text-left p-2">Weight (kg)</th>
                  <th className="text-left p-2">Rate (₹/kg)</th>
                  <th className="text-left p-2">Total Earnings</th>
                  <th className="text-left p-2">Commission</th>
                  <th className="text-left p-2">Service Charge</th>
                  <th className="text-left p-2">Your Total</th>
                  <th className="text-left p-2">Net to Customer</th>
                  <th className="text-left p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {chillieTransactions.slice().reverse().map(transaction => {
                  const isToday = format(new Date(transaction.transaction_date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                  
                  return (
                    <tr key={transaction.id} className={`border-b hover:bg-gray-50 ${isToday ? 'bg-green-50' : ''}`}>
                      <td className="p-2 font-medium">{transaction.customers?.name || 'Unknown'}</td>
                      <td className="p-2">{transaction.number_of_bags}</td>
                      <td className="p-2">{parseFloat(transaction.weight_kg).toFixed(2)}</td>
                      <td className="p-2">₹{parseFloat(transaction.market_rate).toFixed(2)}</td>
                      <td className="p-2">₹{parseFloat(transaction.total_earnings).toFixed(2)}</td>
                      <td className="p-2 text-green-600">₹{parseFloat(transaction.commission).toFixed(2)}</td>
                      <td className="p-2 text-green-600">₹{parseFloat(transaction.service_charge).toFixed(2)}</td>
                      <td className="p-2 font-medium text-purple-600">₹{parseFloat(transaction.total_charges).toFixed(2)}</td>
                      <td className="p-2 font-medium text-blue-600">₹{parseFloat(transaction.net_amount).toFixed(2)}</td>
                      <td className="p-2">
                        {format(new Date(transaction.transaction_date), 'MMM dd, yyyy')}
                        {isToday && <span className="ml-1 text-xs bg-green-100 text-green-800 px-1 rounded">Today</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Business Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-lg font-bold text-gray-800 mb-4">Earnings Breakdown</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Commission (2%)</span>
              <span className="font-medium text-green-600">₹{totalCommission.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service Charges (₹29/bag)</span>
              <span className="font-medium text-green-600">₹{totalServiceCharges.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between">
                <span className="font-medium text-gray-800">Total Earnings</span>
                <span className="font-bold text-purple-600">₹{totalEarnings.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-lg font-bold text-gray-800 mb-4">Trading Statistics</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Average per bag</span>
              <span className="font-medium">{totalBagsTraded > 0 ? (totalChilliesTraded / totalBagsTraded).toFixed(2) : 0} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average market rate</span>
              <span className="font-medium">₹{chillieTransactions.length > 0 ? (chillieTransactions.reduce((sum, t) => sum + parseFloat(t.market_rate), 0) / chillieTransactions.length).toFixed(2) : 0}/kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total transactions</span>
              <span className="font-medium">{chillieTransactions.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
