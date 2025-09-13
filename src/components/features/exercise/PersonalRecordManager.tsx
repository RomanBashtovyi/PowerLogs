'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/components/providers'
import { Button } from '@/components/ui/button'
import PersonalRecordModal from './PersonalRecordModal'
import { PersonalRecord, Exercise } from '@/types/workout'

interface PersonalRecordManagerProps {
  exercise: Exercise
  onRecordUpdated?: (record: PersonalRecord) => void
  className?: string
}

export default function PersonalRecordManager({
  exercise,
  onRecordUpdated,
  className = '',
}: PersonalRecordManagerProps) {
  const { t } = useLanguage()
  const [personalRecord, setPersonalRecord] = useState<PersonalRecord | null>(null)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  const handleToggleExpanded = () => {
    if (!isExpanded && !hasLoaded) {
      fetchPersonalRecord() // Only fetch when expanding for first time
    }
    setIsExpanded(!isExpanded)
  }

  const fetchPersonalRecord = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/personal-records/${exercise.id}`)

      if (response.ok) {
        const record = await response.json()
        setPersonalRecord(record)
      } else if (response.status === 404) {
        // No personal record exists for this exercise - this is normal
        setPersonalRecord(null)
      } else {
        console.error('Error fetching personal record:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error fetching personal record:', error)
    } finally {
      setLoading(false)
      setHasLoaded(true)
    }
  }

  const handleUpdateRecord = async (record: {
    recordType: 'weight' | 'reps'
    oneRepMax?: number
    maxReps?: number
  }) => {
    try {
      setModalLoading(true)
      const response = await fetch('/api/personal-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId: exercise.id,
          recordType: record.recordType,
          ...(record.recordType === 'weight'
            ? { oneRepMax: record.oneRepMax, unit: 'kg' }
            : { maxReps: record.maxReps }),
          notes: null,
        }),
      })

      if (response.ok) {
        const updatedRecord = await response.json()
        setPersonalRecord(updatedRecord)
        setShowModal(false)
        setIsExpanded(true) // Keep expanded after creating/updating
        onRecordUpdated?.(updatedRecord)
      } else {
        const errorData = await response.json()
        console.error('Error updating personal record:', errorData.error)
      }
    } catch (error) {
      console.error('Error updating personal record:', error)
    } finally {
      setModalLoading(false)
    }
  }

  const handleDeleteRecord = async () => {
    if (!personalRecord) return

    try {
      setLoading(true)
      const response = await fetch(`/api/personal-records/${exercise.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPersonalRecord(null)
        setIsExpanded(false) // Collapse after deleting
        onRecordUpdated?.(null as any)
      } else {
        console.error('Error deleting personal record')
      }
    } catch (error) {
      console.error('Error deleting personal record:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`${className}`}>
      {!isExpanded ? (
        // Collapsed state - just a small button
        <div className="flex items-center justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleExpanded}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            🏆 {t('personalRecord') || 'PR'}
          </Button>
        </div>
      ) : (
        // Expanded state - full PR management
        <div className="space-y-3 border-t pt-3 mt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-foreground">🏆 {t('personalRecord') || 'Personal Record'}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleExpanded}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                ✕
              </Button>
            </div>
            {!loading && (
              <Button variant="outline" size="sm" onClick={() => setShowModal(true)}>
                {personalRecord ? t('update') || 'Update' : t('setPR') || 'Set PR'}
              </Button>
            )}
          </div>

          {loading ? (
            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <p className="text-sm text-muted-foreground">{t('loading') || 'Loading...'}</p>
            </div>
          ) : personalRecord ? (
            <div className="bg-accent/10 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-foreground">
                  {personalRecord.recordType === 'weight'
                    ? `${personalRecord.oneRepMax} ${personalRecord.unit}`
                    : `${personalRecord.maxReps} ${t('reps') || 'reps'}`}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeleteRecord}
                  disabled={loading}
                  className="text-destructive hover:text-destructive"
                >
                  {t('delete') || 'Delete'}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {personalRecord.recordType === 'weight' ? t('oneRepMax') || '1RM' : t('maxReps') || 'Max Reps'} •{' '}
                {t('setOn') || 'Set on'}: {new Date(personalRecord.dateSet).toLocaleDateString()}
              </p>
              {personalRecord.notes && (
                <p className="text-sm text-muted-foreground">
                  {t('notes') || 'Notes'}: {personalRecord.notes}
                </p>
              )}
            </div>
          ) : (
            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <p className="text-sm text-muted-foreground">{t('noPRSet') || 'No personal record set'}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {t('setPRHelp') || 'Set your 1RM to use percentage-based programming'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Update Personal Record Modal */}
      <PersonalRecordModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleUpdateRecord}
        currentRecord={
          personalRecord
            ? {
                recordType: personalRecord.recordType,
                oneRepMax: personalRecord.oneRepMax,
                maxReps: personalRecord.maxReps,
              }
            : undefined
        }
        exerciseCategory={exercise.category}
        loading={modalLoading}
      />
    </div>
  )
}
