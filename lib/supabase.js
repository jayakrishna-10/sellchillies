import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database operations
export const db = {
  // Customers
  async getCustomers() {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async createCustomer(customer) {
    const { data, error } = await supabase
      .from('customers')
      .insert([customer])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async updateCustomer(id, updates) {
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async deleteCustomer(id) {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Loans
  async getLoans() {
    const { data, error } = await supabase
      .from('loans')
      .select(`
        *,
        customers (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async createLoan(loan) {
    const { data, error } = await supabase
      .from('loans')
      .insert([loan])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async getLoansByCustomer(customerId) {
    const { data, error } = await supabase
      .from('loans')
      .select('*')
      .eq('customer_id', customerId)
    
    if (error) throw error
    return data
  },

  // Recoveries
  async getRecoveries() {
    const { data, error } = await supabase
      .from('recoveries')
      .select(`
        *,
        customers (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async createRecovery(recovery) {
    const { data, error } = await supabase
      .from('recoveries')
      .insert([recovery])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async getRecoveriesByCustomer(customerId) {
    const { data, error } = await supabase
      .from('recoveries')
      .select('*')
      .eq('customer_id', customerId)
    
    if (error) throw error
    return data
  },

  // Chillies Transactions
  async getChilliesTransactions() {
    const { data, error } = await supabase
      .from('chillies_transactions')
      .select(`
        *,
        customers (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async createChilliesTransaction(transaction) {
    const { data, error } = await supabase
      .from('chillies_transactions')
      .insert([transaction])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async getChilliesTransactionsByCustomer(customerId) {
    const { data, error } = await supabase
      .from('chillies_transactions')
      .select('*')
      .eq('customer_id', customerId)
    
    if (error) throw error
    return data
  },

  // Dashboard analytics
  async getDashboardStats() {
    try {
      const [customers, loans, recoveries, transactions] = await Promise.all([
        this.getCustomers(),
        this.getLoans(),
        this.getRecoveries(),
        this.getChilliesTransactions()
      ])

      const totalCustomers = customers.length
      const totalCommission = transactions.reduce((sum, t) => sum + parseFloat(t.commission), 0)
      const totalServiceCharges = transactions.reduce((sum, t) => sum + parseFloat(t.service_charge), 0)
      const totalChilliesTraded = transactions.reduce((sum, t) => sum + parseFloat(t.weight_kg), 0)

      // Calculate outstanding loans with interest
      const today = new Date()
      let totalOutstandingLoans = 0

      const customerBalances = {}
      customers.forEach(customer => {
        customerBalances[customer.id] = 0
      })

      // Add loans with interest
      loans.forEach(loan => {
        const loanDate = new Date(loan.loan_date)
        const daysDiff = Math.floor((today - loanDate) / (1000 * 60 * 60 * 24))
        const interestPeriods = Math.floor(daysDiff / 30)
        const interestAmount = parseFloat(loan.amount) * (parseFloat(loan.interest_rate) / 100) * interestPeriods
        const currentAmount = parseFloat(loan.amount) + interestAmount
        
        if (customerBalances[loan.customer_id] !== undefined) {
          customerBalances[loan.customer_id] += currentAmount
        }
      })

      // Subtract recoveries
      recoveries.forEach(recovery => {
        if (customerBalances[recovery.customer_id] !== undefined) {
          customerBalances[recovery.customer_id] -= parseFloat(recovery.amount)
        }
      })

      // Sum up positive balances
      totalOutstandingLoans = Object.values(customerBalances)
        .filter(balance => balance > 0)
        .reduce((sum, balance) => sum + balance, 0)

      return {
        totalCustomers,
        totalOutstandingLoans,
        totalCommission,
        totalServiceCharges,
        totalChilliesTraded,
        customerBalances
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw error
    }
  }
}
