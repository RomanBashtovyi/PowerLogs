'use client'

import { useState } from 'react'
import { useLanguage } from '@/components/providers'
import { Button } from '@/components/ui/button'
import { estimateOneRepMax } from '@/utils/percentage-calculations'

interface PersonalRecordModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (record: { recordType: 'weight' | 'reps'; oneRepMax?: number; maxReps?: number }) => void
  currentRecord?: { recordType: 'weight' | 'reps'; oneRepMax?: number; maxReps?: number }
  exerciseCategory?: string
  loading?: boolean
}

export default function PersonalRecordModal({
  isOpen,
  onClose,
  onConfirm,
  currentRecord,
  exerciseCategory = 'strength',
  loading = false,
}: PersonalRecordModalProps) {
  const { t } = useLanguage()

  // Determine if exercise should use reps or weight by default
  const isBodyweightExercise =
    exerciseCategory === 'flexibility' || (exerciseCategory === 'strength' && !currentRecord?.recordType)

  const [recordType, setRecordType] = useState<'weight' | 'reps'>(
    currentRecord?.recordType || (isBodyweightExercise ? 'reps' : 'weight')
  )
  const [method, setMethod] = useState<'direct' | 'calculate'>('direct')
  const [directValue, setDirectValue] = useState(
    currentRecord?.recordType === 'weight'
      ? currentRecord.oneRepMax?.toString() || ''
      : currentRecord?.recordType === 'reps'
        ? currentRecord.maxReps?.toString() || ''
        : ''
  )
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')

  if (!isOpen) return null

  const calculatedMax = weight && reps ? estimateOneRepMax(parseFloat(weight), parseInt(reps)) : 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (recordType === 'reps') {
      const maxReps = parseInt(directValue)
      if (!maxReps || maxReps <= 0) return
      onConfirm({ recordType: 'reps', maxReps })
    } else {
      // Weight-based record
      let oneRepMax: number

      if (method === 'direct') {
        oneRepMax = parseFloat(directValue)
        if (!oneRepMax || oneRepMax <= 0) return
      } else {
        if (!weight || !reps || parseFloat(weight) <= 0 || parseInt(reps) <= 0) return
        oneRepMax = calculatedMax
      }

      onConfirm({ recordType: 'weight', oneRepMax })
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const isValid =
    recordType === 'reps'
      ? directValue && parseFloat(directValue) > 0
      : method === 'direct'
        ? directValue && parseFloat(directValue) > 0
        : weight && reps && parseFloat(weight) > 0 && parseInt(reps) > 0

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-background border border-border rounded-lg shadow-lg max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🏆</span>
            <h2 className="text-xl font-semibold text-foreground">
              {currentRecord
                ? t('updatePersonalRecord') || 'Update Personal Record'
                : t('setPersonalRecord') || 'Set Personal Record'}
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {recordType === 'reps'
              ? t('setPRRepsDescription') || 'Set your maximum reps for this exercise'
              : t('setPRDescription') || 'Set your one-rep max for percentage-based programming'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Record Type Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">{t('recordType') || 'Record Type'} *</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="recordType"
                    checked={recordType === 'weight'}
                    onChange={() => setRecordType('weight')}
                    className="rounded border-input bg-background text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">{t('weightBased') || 'Weight-based (1RM)'}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="recordType"
                    checked={recordType === 'reps'}
                    onChange={() => setRecordType('reps')}
                    className="rounded border-input bg-background text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">{t('repsBased') || 'Reps-based (max reps)'}</span>
                </label>
              </div>
            </div>
            {/* Method Selection - only for weight-based records */}
            {recordType === 'weight' && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-foreground">
                  {t('howToSetPR') || 'How would you like to set your 1RM?'}
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="method"
                      checked={method === 'direct'}
                      onChange={() => setMethod('direct')}
                      className="rounded border-input bg-background text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-foreground">{t('enterDirectly') || 'Enter 1RM directly'}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="method"
                      checked={method === 'calculate'}
                      onChange={() => setMethod('calculate')}
                      className="rounded border-input bg-background text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-foreground">
                      {t('calculateFromSet') || 'Calculate from weight × reps'}
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Input Fields */}
            {recordType === 'reps' ? (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">{t('maxReps') || 'Max Reps'} *</label>
                <input
                  type="number"
                  min="1"
                  value={directValue}
                  onChange={(e) => setDirectValue(e.target.value)}
                  placeholder={t('enterMaxReps') || 'Enter max reps'}
                  autoFocus
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>
            ) : method === 'direct' ? (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {t('oneRepMax') || '1RM'} (kg) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  value={directValue}
                  onChange={(e) => setDirectValue(e.target.value)}
                  placeholder={t('enterWeight') || 'Enter weight'}
                  autoFocus
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {t('weight') || 'Weight'} (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder={t('enterWeight') || 'Enter weight'}
                    autoFocus
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">{t('reps') || 'Reps'} *</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    placeholder={t('enterReps') || 'Enter reps'}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                {calculatedMax > 0 && (
                  <div className="bg-accent/10 rounded-lg p-3">
                    <p className="text-sm text-foreground">
                      <strong>{t('estimated1RM') || 'Estimated 1RM'}:</strong> {calculatedMax}kg
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('epleyFormula') || 'Calculated using Epley formula'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 p-6 pt-2 bg-accent/10">
          <Button variant="outline" onClick={onClose} disabled={loading} className="flex-1">
            {t('cancel') || 'Cancel'}
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !isValid} className="flex-1">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                {t('saving') || 'Saving...'}
              </>
            ) : (
              t('save') || 'Save'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
