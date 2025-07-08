import React from 'react'
import { Plus, Search } from 'lucide-react'

export default function CustomersTab({ 
  customers, 
  newCustomer, 
  setNewCustomer, 
  addCustomer,
  searchTerm,
  setSearchTerm,
  dashboardStats
}) {
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone && customer.phone.includes(searchTerm))
  )

  const getCustomerBalance = (customerId) => {
    return dashboardStats.customerBalances?.[customerId] || 0
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Customer Management</h2>
      </div>

      {/* Add Customer Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Customer</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Customer Name"
            value={newCustomer.name}
            onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={newCustomer.phone}
            onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <input
            type="text"
            placeholder="Address"
            value={newCustomer.address}
            onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <button
          onClick={addCustomer}
          disabled={!newCustomer.name.trim()}
          className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Customers List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Customers List ({filteredCustomers.length})</h3>
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No customers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Phone</th>
                  <th className="text-left p-2">Address</th>
                  <th className="text-left p-2">Balance</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(customer => {
                  const balance = getCustomerBalance(customer.id)
                  return (
                    <tr key={customer.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{customer.name}</td>
                      <td className="p-2">{customer.phone || '-'}</td>
                      <td className="p-2">{customer.address || '-'}</td>
                      <td className="p-2">
                        <span className={`font-medium ${balance > 0 ? 'text-red-600' : balance < 0 ? 'text-blue-600' : 'text-green-600'}`}>
                          ₹{Math.abs(balance).toFixed(2)}
                        </span>
                      </td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          balance > 0 
                            ? 'bg-red-100 text-red-800' 
                            : balance < 0 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {balance > 0 ? 'Outstanding' : balance < 0 ? 'Credit' : 'Clear'}
                        </span>
                      </td>
                      <td className="p-2">{new Date(customer.created_at).toLocaleDateString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
