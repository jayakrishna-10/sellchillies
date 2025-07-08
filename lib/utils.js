import { differenceInDays } from 'date-fns'

/**
 * Calculate loan amount with interest
 * @param {Object} loan - Loan object with amount, interest_rate, and loan_date
 * @returns {number} - Current loan amount with interest
 */
export function calculateLoanWithInterest(loan) {
  const loanDate = new Date(loan.loan_date)
  const today = new Date()
  const daysDiff = differenceInDays(today, loanDate)
  const interestPeriods = Math.floor(daysDiff / 30)
  const interestAmount = parseFloat(loan.amount) * (parseFloat(loan.interest_rate) / 100) * interestPeriods
  return parseFloat(loan.amount) + interestAmount
}

/**
 * Calculate customer balance (loans with interest - recoveries)
 * @param {string} customerId - Customer ID
 * @param {Array} loans - Array of loan objects
 * @param {Array} recoveries - Array of recovery objects
 * @returns {number} - Customer balance
 */
export function calculateCustomerBalance(customerId, loans, recoveries) {
  const customerLoans = loans.filter(loan => loan.customer_id === customerId)
  const customerRecoveries = recoveries.filter(recovery => recovery.customer_id === customerId)
  
  const totalLoansWithInterest = customerLoans.reduce((sum, loan) => sum + calculateLoanWithInterest(loan), 0)
  const totalRecoveries = customerRecoveries.reduce((sum, recovery) => sum + parseFloat(recovery.amount), 0)
  
  return totalLoansWithInterest - totalRecoveries
}

/**
 * Calculate chillies transaction amounts
 * @param {number} numberOfBags - Number of bags
 * @param {number} weightKg - Weight in kg
 * @param {number} marketRate - Market rate per kg
 * @returns {Object} - Calculated amounts
 */
export function calculateChilliesTransaction(numberOfBags, weightKg, marketRate) {
  const bags = parseInt(numberOfBags)
  const weight = parseFloat(weightKg)
  const rate = parseFloat(marketRate)
  
  const totalEarnings = (weight * rate) + (bags * 45)
  const commission = totalEarnings * 0.02 // 2% commission
  const serviceCharge = bags * 29 // ₹29 per bag
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

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

/**
 * Format number with Indian number system
 * @param {number} number - Number to format
 * @returns {string} - Formatted number string
 */
export function formatNumber(number) {
  return new Intl.NumberFormat('en-IN').format(number)
}

/**
 * Get loan status based on days elapsed
 * @param {Object} loan - Loan object
 * @returns {Object} - Status object with color and text
 */
export function getLoanStatus(loan) {
  const daysDiff = differenceInDays(new Date(), new Date(loan.loan_date))
  
  if (daysDiff > 90) {
    return { status: 'Overdue', color: 'text-red-800 bg-red-100' }
  } else if (daysDiff > 60) {
    return { status: 'Due Soon', color: 'text-yellow-800 bg-yellow-100' }
  } else {
    return { status: 'Active', color: 'text-green-800 bg-green-100' }
  }
}

/**
 * Get customer balance status
 * @param {number} balance - Customer balance
 * @returns {Object} - Status object with color and text
 */
export function getBalanceStatus(balance) {
  if (balance > 0) {
    return { status: 'Outstanding', color: 'text-red-800 bg-red-100' }
  } else if (balance < 0) {
    return { status: 'Credit', color: 'text-blue-800 bg-blue-100' }
  } else {
    return { status: 'Clear', color: 'text-green-800 bg-green-100' }
  }
}

/**
 * Validate form data
 * @param {Object} data - Form data to validate
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} - Validation result
 */
export function validateFormData(data, requiredFields) {
  const errors = {}
  
  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors[field] = 'This field is required'
    }
  })
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Export data to CSV
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Filename for the CSV
 */
export function exportToCSV(data, filename) {
  if (!data.length) return
  
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    )
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

/**
 * Get relative time string
 * @param {Date|string} date - Date to compare
 * @returns {string} - Relative time string
 */
export function getRelativeTime(date) {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const now = new Date()
  const targetDate = new Date(date)
  const diffInDays = differenceInDays(now, targetDate)
  
  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return rtf.format(-diffInDays, 'day')
  if (diffInDays < 30) return rtf.format(-Math.floor(diffInDays / 7), 'week')
  if (diffInDays < 365) return rtf.format(-Math.floor(diffInDays / 30), 'month')
  return rtf.format(-Math.floor(diffInDays / 365), 'year')
}

/**
 * Generate summary statistics
 * @param {Array} data - Array of numbers
 * @returns {Object} - Statistics object
 */
export function generateStats(data) {
  if (!data.length) return { sum: 0, average: 0, min: 0, max: 0, count: 0 }
  
  const sum = data.reduce((acc, val) => acc + val, 0)
  const average = sum / data.length
  const min = Math.min(...data)
  const max = Math.max(...data)
  
  return { sum, average, min, max, count: data.length }
}
