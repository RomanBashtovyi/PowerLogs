'use client'

import { useState, useEffect } from 'react'
import { Button } from './button'

export interface ToastData {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

interface ToastProps {
  toast: ToastData
  onClose: (id: string) => void
}

function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id)
    }, toast.duration || 5000)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onClose])

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-100 border-green-400 text-green-700'
      case 'error':
        return 'bg-red-100 border-red-400 text-red-700'
      case 'warning':
        return 'bg-yellow-100 border-yellow-400 text-yellow-700'
      case 'info':
        return 'bg-blue-100 border-blue-400 text-blue-700'
      default:
        return 'bg-gray-100 border-gray-400 text-gray-700'
    }
  }

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'warning':
        return '⚠'
      case 'info':
        return 'ℹ'
      default:
        return ''
    }
  }

  return (
    <div className={`border-l-4 p-4 rounded-md shadow-md max-w-md ${getToastStyles()}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <span className="mr-2 text-lg">{getIcon()}</span>
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onClose(toast.id)}
          className="ml-2 h-auto p-1 text-current hover:bg-transparent"
        >
          ✕
        </Button>
      </div>
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastData[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onRemove} />
      ))}
    </div>
  )
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const addToast = (message: string, type: ToastData['type'] = 'info', duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9)
    const toast: ToastData = { id, message, type, duration }
    setToasts((prev) => [...prev, toast])
    return id
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const showSuccess = (message: string, duration?: number) => addToast(message, 'success', duration)
  const showError = (message: string, duration?: number) => addToast(message, 'error', duration)
  const showWarning = (message: string, duration?: number) => addToast(message, 'warning', duration)
  const showInfo = (message: string, duration?: number) => addToast(message, 'info', duration)

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
}
