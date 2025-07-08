import React from 'react'
import { Plus } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'

export default function LoansTab({ 
  customers, 
  loans, 
  newLoan, 
  setNewLoan, 
  addLoan 
}) {
  // Calculate loan with interest
  const calculateLoanWithInterest = (loan) => {
    const loanDate = new Date(loan.loan_date)
    const today = new Date()
    const daysDiff = differenceInDays(today, loanDate)
    const interestPeriods = Math.floor(daysDiff / 30)
    const interestAmount = parseFloat(loan.amount) * (parseFloat(loan.interest_rate) / 100) * interestPeriods
    return parseFloat(loan.amount) + interestAmount
  }

  const totalLoansValue = loans.reduce((sum, loan) => sum + calculateLoanWithInterest(loan), 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Loan Management</h2>
        <div className="text-sm text-gray-600">
          Total Active Loans: <span className="font-bold text-red-600">₹{totalLoansValue.toFixed(2)}</span>
        </div>
      </div>

      {/* Add Loan Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Loan</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={newLoan.customer_id}
            onChange={(e) => setNewLoan({...newLoan, customer_id: e.target.value})}
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
            placeholder="Loan Amount (₹)"
            value={newLoan.amount}
            onChange={(e) => setNewLoan({...newLoan, amount: e.target.value})}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
          <input
            type="date"
            value={newLoan.loan_date}
            onChange={(e) => setNewLoan({...newLoan, loan_date: e.target.value})}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Interest Rate (%)"
            value={newLoan.interest_rate}
            onChange={(e) => setNewLoan({...newLoan, interest_rate: e.target.value})}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        {/* Loan Preview */}
        {newLoan.amount && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Loan Preview:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Principal Amount:</p>
                <p className="font-medium">₹{parseFloat(newLoan.amount || 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">Interest Rate:</p>
                <p className="font-medium">{newLoan.interest_rate}% per 30 days</p>
              </div>
              <div>
                <p className="text-gray-600">Monthly Interest:</p>
                <p className="font-medium text-orange-600">₹{(parseFloat(newLoan.amount || 0) * (parseFloat(newLoan.interest_rate) / 100)).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">Loan Date:</p>
                <p className="font-medium">{format(new Date(newLoan.loan_date), 'MMM dd, yyyy')}</p>
              </div>
            </div>
          </div>
        )}
        
        <button
          onClick={addLoan}
          disabled={!newLoan.customer_id || !newLoan.amount}
          className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Loan
        </button>
      </div>

      {/* Loans List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Active Loans ({loans.length})</h3>
        
        {loans.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No loans found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Customer</th>
                  <th className="text-left p-2">Principal</th>
                  <th className="text-left p-2">Interest Rate</th>
                  <th className="text-left p-2">Current Amount</th>
                  <th className="text-left p-2">Interest Earned</th>
                  <th className="text-left p-2">Loan Date</th>
                  <th className="text-left p-2">Days</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {loans.map(loan => {
                  const currentAmount = calculateLoanWithInterest(loan)
                  const interestEarned = currentAmount - parseFloat(loan.amount)
                  const daysDiff = differenceInDays(new Date(), new Date(loan.loan_date))
                  const isOverdue = daysDiff > 90 // Consider loans overdue after 90 days
                  
                  return (
                    <tr key={loan.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{loan.customers?.name || 'Unknown'}</td>
                      <td className="p-2">₹{parseFloat(loan.amount).toFixed(2)}</td>
                      <td className="p-2">{loan.interest_rate}%</td>
                      <td className="p-2 font-medium text-red-600">₹{currentAmount.toFixed(2)}</td>
                      <td className="p-2 text-green-600">₹{interestEarned.toFixed(2)}</td>
                      <td className="p-2">{format(new Date(loan.loan_date), 'MMM dd, yyyy')}</td>
                      <td className="p-2">{daysDiff} days</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          isOverdue 
                            ? 'bg-red-100 text-red-800' 
                            : daysDiff > 60 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {isOverdue ? 'Overdue' : daysDiff > 60 ? 'Due Soon' : 'Active'}
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

      {/* Loan Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-bold text-gray-800 mb-2">Total Principal</h4>
          <p className="text-2xl font-bold text-blue-600">
            ₹{loans.reduce((sum, loan) => sum + parseFloat(loan.amount), 0).toFixed(2)}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-bold text-gray-800 mb-2">Interest Earned</h4>
          <p className="text-2xl font-bold text-green-600">
            ₹{loans.reduce((sum, loan) => {
              const currentAmount = calculateLoanWithInterest(loan)
              return sum + (currentAmount - parseFloat(loan.amount))
            }, 0).toFixed(2)}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-bold text-gray-800 mb-2">Total Outstanding</h4>
          <p className="text-2xl font-bold text-red-600">
            ₹{totalLoansValue.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}
