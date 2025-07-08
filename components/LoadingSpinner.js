import React from 'react'

export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  return (
    <div className={`inline-block ${sizeClasses[size]} ${className}`}>
      <div className="spinner border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin w-full h-full"></div>
    </div>
  )
}

export function LoadingCard({ title = 'Loading...', description = 'Please wait while we fetch your data.' }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      <LoadingSpinner size="lg" className="mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

export function LoadingOverlay({ isLoading, children }) {
  if (!isLoading) return children

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    </div>
  )
}
