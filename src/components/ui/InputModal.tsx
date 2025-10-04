'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from '@/hooks'
import { Button } from '@/components/ui/button'

interface InputModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (value: string) => void
  title: string
  message?: string
  placeholder?: string
  defaultValue?: string
  confirmText?: string
  cancelText?: string
  icon?: string
  loading?: boolean
  required?: boolean
}

export default function InputModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  placeholder,
  defaultValue = '',
  confirmText,
  cancelText,
  icon = '✏️',
  loading = false,
  required = true,
}: InputModalProps) {
  const { t } = useTranslations()
  const [value, setValue] = useState(defaultValue)

  // Reset value when modal opens
  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue)
    }
  }, [isOpen, defaultValue])

  if (!isOpen) return null

  const handleConfirm = () => {
    const trimmedValue = value.trim()
    if (required && !trimmedValue) return
    onConfirm(trimmedValue)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleConfirm()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  const isValid = !required || value.trim().length > 0

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-background border border-border rounded-lg shadow-lg max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{icon}</span>
            <h2 className="text-xl font-semibold text-foreground">
              {title}
            </h2>
          </div>
          {message && (
            <p className="text-muted-foreground leading-relaxed mb-4">
              {message}
            </p>
          )}

          {/* Input Field */}
          <div className="space-y-2">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              autoFocus
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
              disabled={loading}
            />
            {required && !isValid && value.length > 0 && (
              <p className="text-sm text-destructive">
                {t('fieldRequired') ||
                  'This field is required'}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 p-6 pt-2 bg-accent/10">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            {cancelText || t('cancel')}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading || !isValid}
            className="flex-1"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                {t('loading')}
              </>
            ) : (
              confirmText || t('confirm')
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
