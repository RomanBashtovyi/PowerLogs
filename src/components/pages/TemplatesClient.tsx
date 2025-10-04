'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'
import { useTranslations } from '@/hooks'
import { Button } from '@/components/ui/button'
import {
  ToastContainer,
  useToast,
} from '@/components/ui/Toast'
import ConfirmationModal from '@/components/ui/ConfirmationModal'
import { Workout } from '@/types/workout'
import { useConfirmation } from '@/hooks/useConfirmation'

export default function TemplatesClient() {
  const { t } = useTranslations()
  const language = 'uk'
  const router = useRouter()
  const { toasts, removeToast, showSuccess, showError } =
    useToast()
  const {
    confirmationState,
    showConfirmation,
    hideConfirmation,
    setLoading: setConfirmationLoading,
  } = useConfirmation()

  const [templates, setTemplates] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/templates')

      if (!response.ok) {
        throw new Error('Failed to fetch templates')
      }

      const data = await response.json()
      setTemplates(data.templates || [])
    } catch (err) {
      setError('Failed to load templates')
      console.error('Error fetching templates:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUseTemplate = async (
    templateId: string,
    templateName: string
  ) => {
    const confirmed = await showConfirmation({
      title: t('useTemplate') || 'Use Template',
      message: `${t('useTemplateConfirm') || 'Use template'} "${templateName}" ${t('forTodaysWorkout') || "for today's workout"}?`,
      confirmText: t('yes') || 'Yes',
      cancelText: t('cancel') || 'Cancel',
    })

    if (confirmed) {
      executeUseTemplate(templateId, templateName, true)
    }
  }

  const executeUseTemplate = async (
    templateId: string,
    templateName: string,
    useToday: boolean
  ) => {
    try {
      const response = await fetch(
        `/api/templates/${templateId}/use`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: useToday
              ? new Date().toISOString()
              : undefined,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.error ||
            'Не вдалося створити тренування з шаблону'
        )
      }

      const workout = await response.json()
      showSuccess(
        `Workout created from template "${templateName}"`
      )

      // Redirect to the new workout
      router.push(`/workouts/${workout.id}`)
    } catch (err) {
      console.error('Error using template:', err)
      showError(
        err instanceof Error
          ? err.message
          : 'Не вдалося створити тренування'
      )
    }
  }

  const handleDeleteTemplate = async (
    templateId: string,
    templateName: string
  ) => {
    const confirmed = await showConfirmation({
      title: 'Delete Template',
      message: `Are you sure you want to delete the template "${templateName}"? This action cannot be undone.`,
      confirmText: 'Delete Template',
      cancelText: 'Cancel',
      confirmVariant: 'destructive',
      icon: '🗑️',
    })

    if (!confirmed) return

    try {
      setConfirmationLoading(true)

      const response = await fetch(
        `/api/templates/${templateId}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete template')
      }

      showSuccess(
        `Template "${templateName}" deleted successfully`
      )
      await fetchTemplates() // Refresh list
    } catch (err) {
      console.error('Error deleting template:', err)
      showError('Failed to delete template')
    } finally {
      setConfirmationLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    const locale = uk
    return format(date, 'MMM dd, yyyy', { locale })
  }

  const getTemplateStats = (template: Workout) => {
    const exerciseCount = template.exercises?.length || 0
    const setCount =
      template.exercises?.reduce(
        (total, ex) => total + (ex.sets?.length || 0),
        0
      ) || 0

    return { exerciseCount, setCount }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-6">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                {t('loading')}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-6">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Something went wrong
            </h3>
            <p className="text-muted-foreground mb-4">
              {error}
            </p>
            <Button onClick={fetchTemplates}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Workout Templates
            </h1>
            <p className="text-muted-foreground">
              Create, manage, and use your workout templates
            </p>
          </div>

          <div className="flex gap-2">
            <Link href="/workouts/new">
              <Button variant="outline">
                ➕ New Workout
              </Button>
            </Link>
            <Link href="/workouts">
              <Button variant="outline">
                ← Back to Workouts
              </Button>
            </Link>
          </div>
        </div>

        {/* Templates Grid */}
        {templates.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Templates Yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Create your first template by saving a workout
              as a template
            </p>
            <Link href="/workouts">
              <Button>Go to Workouts</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => {
              const { exerciseCount, setCount } =
                getTemplateStats(template)

              return (
                <div
                  key={template.id}
                  className="fitness-card p-6 hover:shadow-lg transition-shadow"
                >
                  {/* Template Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {template.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                          Template
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(
                            new Date(template.createdAt)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {template.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {template.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-foreground">
                        {exerciseCount}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Exercises
                      </p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">
                        {setCount}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Sets
                      </p>
                    </div>
                  </div>

                  {/* Exercise Preview */}
                  {template.exercises &&
                    template.exercises.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          Exercises:
                        </p>
                        <div className="space-y-1">
                          {template.exercises
                            .slice(0, 3)
                            .map((ex) => (
                              <p
                                key={ex.id}
                                className="text-xs text-foreground"
                              >
                                • {ex.exercise?.name} (
                                {ex.sets?.length || 0} sets)
                              </p>
                            ))}
                          {template.exercises.length >
                            3 && (
                            <p className="text-xs text-muted-foreground">
                              +
                              {template.exercises.length -
                                3}{' '}
                              more...
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        handleUseTemplate(
                          template.id,
                          template.name
                        )
                      }
                    >
                      🏋️ Use Template
                    </Button>
                    <Link href={`/workouts/${template.id}`}>
                      <Button variant="outline" size="sm">
                        👁️
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDeleteTemplate(
                          template.id,
                          template.name
                        )
                      }
                      className="text-red-600 hover:bg-red-50"
                    >
                      🗑️
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmationState.isOpen}
          onClose={hideConfirmation}
          onConfirm={confirmationState.onConfirm}
          title={confirmationState.title}
          message={confirmationState.message}
          confirmText={confirmationState.confirmText}
          cancelText={confirmationState.cancelText}
          confirmVariant={confirmationState.confirmVariant}
          icon={confirmationState.icon}
          loading={confirmationState.loading}
        />

        {/* Toast Notifications */}
        <ToastContainer
          toasts={toasts}
          onRemove={removeToast}
        />
      </div>
    </div>
  )
}
