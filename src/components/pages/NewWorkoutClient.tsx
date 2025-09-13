'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/components/providers'
import { Button } from '@/components/ui/button'
import { WorkoutForm, TemplateSelector } from '@/components/features/workout'
import { ToastContainer, useToast } from '@/components/ui/Toast'
import { Workout } from '@/types/workout'

export default function NewWorkoutClient() {
  const { t } = useLanguage()
  const router = useRouter()
  const { toasts, removeToast, showSuccess, showError } = useToast()
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Workout | null>(null)

  const handleUseTemplate = async (template: Workout) => {
    try {
      const response = await fetch(`/api/templates/${template.id}/use`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create workout from template')
      }

      const workout = await response.json()
      showSuccess(`Workout created from template "${template.name}"`)

      // Redirect to the new workout
      router.push(`/workouts/${workout.id}`)
    } catch (err) {
      console.error('Error using template:', err)
      showError(err instanceof Error ? err.message : 'Failed to create workout')
    }
  }

  const handleSelectTemplate = (template: Workout) => {
    setSelectedTemplate(template)
    setShowTemplateSelector(false)
    handleUseTemplate(template)
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('createWorkout')}</h1>
          <p className="text-muted-foreground mt-2">Create a new workout to track your fitness progress</p>
        </div>

        {/* Template Options */}
        <div className="fitness-card p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Start Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-input rounded-lg p-4 text-center">
              <div className="text-4xl mb-2">📋</div>
              <h3 className="font-medium text-foreground mb-2">Use Template</h3>
              <p className="text-sm text-muted-foreground mb-4">Start with a pre-made workout template</p>
              <Button variant="outline" onClick={() => setShowTemplateSelector(true)} className="w-full">
                Choose Template
              </Button>
            </div>

            <div className="border border-input rounded-lg p-4 text-center">
              <div className="text-4xl mb-2">✨</div>
              <h3 className="font-medium text-foreground mb-2">Start Fresh</h3>
              <p className="text-sm text-muted-foreground mb-4">Create a completely new workout from scratch</p>
              <Button className="w-full">Continue Below</Button>
            </div>
          </div>
        </div>

        {/* Form */}
        <WorkoutForm />

        {/* Template Selector Modal */}
        {showTemplateSelector && (
          <TemplateSelector onSelectTemplate={handleSelectTemplate} onClose={() => setShowTemplateSelector(false)} />
        )}

        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </div>
  )
}
