'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Users, DollarSign, Package, TrendingUp, Calendar, Search, AlertCircle } from 'lucide-react'
import { db } from '../lib/supabase'
import { format, differenceInDays } from 'date-fns'
import CustomersTab from '../components/CustomersTab'
import LoansTab from '../components/LoansTab'
import RecoveriesTab from '../components/RecoveriesTab'
import ChilliesTab from '../components/ChilliesTab'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [customers, setCustomers] = useState([])
  const [loans, setLoans] = useState([])
  const [recoveries, setRecoveries] = useState([])
  const [chillieTransactions, setChillieTransactions] = useState([])
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [dashboardStats, setDashboardStats] = useState({
    totalCustomers: 0,
    totalOutstandingLoans: 0,
    totalCommission: 0,
    totalServiceCharges: 0,
    totalChilliesTraded: 0
  })

  // Form states
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    address: ''
  })

  const [newLoan, setNewLoan] = useState({
    customer_id: '',
    amount: '',
    loan_date: new Date().toISOString().split('T')[0],
    interest_rate: 2
  })

  const [newRecovery, setNewRecovery] = useState({
    customer_id: '',
    amount: '',
    recovery_date: new Date().toISOString().split('T')[0]
  })

  const [newChillieTransaction, setNewChillieTransaction] = useState({
    customer_id: '',
    number_of_bags: '',
    weight_kg: '',
    market_rate: '',
    transaction_date: new Date().toISOString().split('T')[0]
  })

  // Load initial data
  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [customersData, loansData, recoveriesData, transactionsData, statsData] = await Promise.all([
        db.getCustomers(),
        db.getLoans(),
        db.getRecoveries(),
        db.getChilliesTransactions(),
        db.getDashboardStats()
      ])

      setCustomers(customersData)
      setLoans(loansData)
      setRecoveries(recoveriesData)
      setChillieTransactions(transactionsData)
      setDashboardStats(statsData)
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load data. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  // Calculate loan with interest
  const calculateLoanWithInterest = (loan) => {
    const loanDate = new Date(loan.loan_date)
    const today = new Date()
    const daysDiff = differenceInDays(today, loanDate)
    const interestPeriods = Math.floor(daysDiff / 30)
    const interestAmount = parseFloat(loan.amount) * (parseFloat(loan.interest_rate) / 100) * interestPeriods
    return parseFloat(loan.amount) + interestAmount
  }

  // Add Customer
  const addCustomer = async () => {
    if (!newCustomer.name.trim()) return

    try {
      await db.createCustomer(newCustomer)
      setNewCustomer({ name: '', phone: '', address: '' })
      loadAllData()
    } catch (err) {
      console.error('Error adding customer:', err)
      setError('Failed to add customer. Please try again.')
    }
  }

  // Add Loan
  const addLoan = async () => {
    if (!newLoan.customer_id || !newLoan.amount) return

    try {
      const loanData = {
        ...newLoan,
        amount: parseFloat(newLoan.amount),
        interest_rate: parseFloat(newLoan.interest_rate)
      }
      
      await db.createLoan(loanData)
      setNewLoan({ 
        customer_id: '', 
        amount: '', 
        loan_date: new Date().toISOString().split('T')[0], 
        interest_rate: 2 
      })
      loadAllData()
    } catch (err) {
      console.error('Error adding loan:', err)
      setError('Failed to add loan. Please try again.')
    }
  }

  // Add Recovery
  const addRecovery = async () => {
    if (!newRecovery.customer_id || !newRecovery.amount) return

    try {
      const recoveryData = {
        ...newRecovery,
        amount: parseFloat(newRecovery.amount)
      }
      
      await db.createRecovery(recoveryData)
      setNewRecovery({ 
        customer_id: '', 
        amount: '', 
        recovery_date: new Date().toISOString().split('T')[0] 
      })
      loadAllData()
    } catch (err) {
      console.error('Error adding recovery:', err)
      setError('Failed to add recovery. Please try again.')
    }
  }

  // Add Chillies Transaction
  const addChillieTransaction = async () => {
    if (!newChillieTransaction.customer_id || !newChillieTransaction.number_of_bags || 
        !newChillieTransaction.weight_kg || !newChillieTransaction.market_rate) return

    try {
      const bags = parseInt(newChillieTransaction.number_of_bags)
      const weight = parseFloat(newChillieTransaction.weight_kg)
      const rate = parseFloat(newChillieTransaction.market_rate)
      
      // Calculate amounts
      const totalEarnings = (weight * rate) + (bags * 45)
      const commission = totalEarnings * 0.02
      const serviceCharge = bags * 29
      const totalCharges = commission + serviceCharge
      const netAmount = totalEarnings - totalCharges
      
      const transactionData = {
        ...newChillieTransaction,
        number_of_bags: bags,
        weight_kg: weight,
        market_rate: rate,
        total_earnings: totalEarnings,
        commission: commission,
        service_charge: serviceCharge,
        total_charges: totalCharges,
        net_amount: netAmount
      }
      
      await db.createChilliesTransaction(transactionData)
      setNewChillieTransaction({ 
        customer_id: '', 
        number_of_bags: '', 
        weight_kg: '', 
        market_rate: '', 
        transaction_date: new Date().toISOString().split('T')[0] 
      })
      loadAllData()
    } catch (err) {
      console.error('Error adding chillies transaction:', err)
      setError('Failed to add transaction. Please try again.')
    }
  }

  // Get customer name by ID
  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId)
    return customer ? customer.name : 'Unknown Customer'
  }

  // Filter customers based on search
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone && customer.phone.includes(searchTerm))
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
        <span className="ml-4 text-lg">Loading...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary-600 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">SellChillies Business Manager</h1>
          <p className="text-primary-100">Chillies Trading & Loan Management System</p>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-4 rounded flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
              { id: 'customers', label: 'Customers', icon: Users },
              { id: 'loans', label: 'Loans', icon: DollarSign },
              { id: 'recoveries', label: 'Recoveries', icon: Calendar },
              { id: 'chillies', label: 'Chillies Trading', icon: Package }
            ].map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-3 text-sm font-medium ${
                    activeTab === tab.id
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Customers</p>
                    <p className="text-2xl font-bold text-gray-800">{dashboardStats.totalCustomers}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8 text-red-500" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Outstanding Loans</p>
                    <p className="text-2xl font-bold text-gray-800">₹{dashboardStats.totalOutstandingLoans.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Commission</p>
                    <p className="text-2xl font-bold text-gray-800">₹{dashboardStats.totalCommission.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <Package className="w-8 h-8 text-orange-500" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Chillies Traded (kg)</p>
                    <p className="text-2xl font-bold text-gray-800">{dashboardStats.totalChilliesTraded.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Chillies Transactions</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Customer</th>
                      <th className="text-left p-2">Bags</th>
                      <th className="text-left p-2">Weight (kg)</th>
                      <th className="text-left p-2">Net Amount</th>
                      <th className="text-left p-2">Commission</th>
                      <th className="text-left p-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chillieTransactions.slice(-5).reverse().map(transaction => (
                      <tr key={transaction.id} className="border-b">
                        <td className="p-2">{transaction.customers?.name || 'Unknown'}</td>
                        <td className="p-2">{transaction.number_of_bags}</td>
                        <td className="p-2">{transaction.weight_kg}</td>
                        <td className="p-2">₹{parseFloat(transaction.net_amount).toFixed(2)}</td>
                        <td className="p-2">₹{parseFloat(transaction.commission).toFixed(2)}</td>
                        <td className="p-2">{format(new Date(transaction.transaction_date), 'MMM dd, yyyy')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <CustomersTab 
            customers={customers}
            newCustomer={newCustomer}
            setNewCustomer={setNewCustomer}
            addCustomer={addCustomer}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            dashboardStats={dashboardStats}
          />
        )}

        {/* Loans Tab */}
        {activeTab === 'loans' && (
          <LoansTab 
            customers={customers}
            loans={loans}
            newLoan={newLoan}
            setNewLoan={setNewLoan}
            addLoan={addLoan}
          />
        )}

        {/* Recoveries Tab */}
        {activeTab === 'recoveries' && (
          <RecoveriesTab 
            customers={customers}
            recoveries={recoveries}
            newRecovery={newRecovery}
            setNewRecovery={setNewRecovery}
            addRecovery={addRecovery}
          />
        )}

        {/* Chillies Trading Tab */}
        {activeTab === 'chillies' && (
          <ChilliesTab 
            customers={customers}
            chillieTransactions={chillieTransactions}
            newChillieTransaction={newChillieTransaction}
            setNewChillieTransaction={setNewChillieTransaction}
            addChillieTransaction={addChillieTransaction}
          />
        )}
      </main>
    </div>
  )
}
