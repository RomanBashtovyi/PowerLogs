'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Workout } from '@/types/workout'

interface TemplateSelectorProps {
  onSelectTemplate: (template: Workout) => void
  onClose: () => void
}

export default function TemplateSelector({ onSelectTemplate, onClose }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates)
      } else {
        throw new Error('Failed to fetch templates')
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
      setError('Failed to load templates')
    } finally {
      setLoading(false)
    }
  }

  const getTemplateStats = (template: Workout) => {
    const exerciseCount = template.exercises?.length || 0
    const setCount = template.exercises?.reduce((total, ex) => total + (ex.sets?.length || 0), 0) || 0

    return { exerciseCount, setCount }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Choose a Template</h3>
          <Button variant="outline" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading templates...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <Button variant="outline" onClick={fetchTemplates} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📋</div>
              <h4 className="text-lg font-semibold mb-2">No Templates Available</h4>
              <p className="text-muted-foreground">Create your first template by saving a workout as a template</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => {
                const { exerciseCount, setCount } = getTemplateStats(template)

                return (
                  <div
                    key={template.id}
                    className="border border-input rounded-lg p-4 hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => onSelectTemplate(template)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground mb-1">{template.name}</h4>
                        <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">Template</span>
                      </div>
                    </div>

                    {template.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{template.description}</p>
                    )}

                    <div className="grid grid-cols-2 gap-2 mb-3 text-center">
                      <div>
                        <p className="text-lg font-bold text-foreground">{exerciseCount}</p>
                        <p className="text-xs text-muted-foreground">Exercises</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-foreground">{setCount}</p>
                        <p className="text-xs text-muted-foreground">Sets</p>
                      </div>
                    </div>

                    {template.exercises && template.exercises.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Exercises:</p>
                        <div className="space-y-1">
                          {template.exercises.slice(0, 2).map((ex) => (
                            <p key={ex.id} className="text-xs text-foreground">
                              • {ex.exercise?.name}
                            </p>
                          ))}
                          {template.exercises.length > 2 && (
                            <p className="text-xs text-muted-foreground">+{template.exercises.length - 2} more...</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-input">
          <Button variant="outline" onClick={onClose}>
            Start from Scratch
          </Button>
          <p className="text-sm text-muted-foreground">Click on a template to use it as a starting point</p>
        </div>
      </div>
    </div>
  )
}
