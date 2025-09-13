import { useState, useCallback } from 'react'

interface ConfirmationOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  icon?: string
}

interface ConfirmationState extends ConfirmationOptions {
  isOpen: boolean
  loading: boolean
  onConfirm: () => void
}

export function useConfirmation() {
  const [state, setState] = useState<ConfirmationState>({
    isOpen: false,
    loading: false,
    title: '',
    message: '',
    onConfirm: () => {},
  })

  const showConfirmation = useCallback((options: ConfirmationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        ...options,
        isOpen: true,
        loading: false,
        onConfirm: () => {
          resolve(true)
          setState((prev) => ({ ...prev, isOpen: false }))
        },
      })

      // Handle rejection (when modal is closed without confirming)
      const cleanup = () => {
        setState((prev) => ({ ...prev, isOpen: false }))
        resolve(false)
      }

      // Store cleanup function for later use
      setState((prev) => ({ ...prev, onCancel: cleanup }))
    })
  }, [])

  const hideConfirmation = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }))
  }, [])

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, loading }))
  }, [])

  return {
    confirmationState: state,
    showConfirmation,
    hideConfirmation,
    setLoading,
  }
}
