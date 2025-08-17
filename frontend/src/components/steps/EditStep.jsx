import React from 'react'
import { colors } from '../../utils/colors'
import { LoadingButton } from '../LoadingComponents'
import SummaryViewer from '../SummaryViewer'

const EditStep = ({ 
  summary, 
  editableSummary, 
  setEditableSummary, 
  isEditing, 
  setIsEditing, 
  onSaveEdit, 
  loading,
  onNext,
  onPrevious
}) => {
  return (
    <div className="space-y-6">
      <h2 
        className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center"
        style={{ color: colors.darkPurple }}
      >
        Edit Your Summary
      </h2>

      {/* Edit Mode Toggle */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
          style={{ 
            backgroundColor: isEditing ? colors.darkBrown : colors.gold,
            color: isEditing ? 'white' : colors.darkPurple
          }}
        >
          {isEditing ? 'Preview' : 'Edit'}
        </button>
        {isEditing && (
          <button
            onClick={onSaveEdit}
            className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
            style={{ 
              backgroundColor: colors.brown,
              color: 'white'
            }}
          >
            Save Changes
          </button>
        )}
      </div>

      {/* Edit Area */}
      {isEditing ? (
        <div>
          <label 
            className="block text-sm font-medium mb-2"
            style={{ color: colors.darkBrown }}
          >
            Edit Summary (plain text):
          </label>
          <textarea
            value={editableSummary}
            onChange={(e) => setEditableSummary(e.target.value)}
            className="w-full h-64 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 transition-all duration-200 font-mono text-sm"
            style={{ 
              borderColor: colors.beige,
              '--tw-ring-color': `${colors.gold}40`
            }}
          />
          <p 
            className="text-xs mt-2"
            style={{ color: colors.brown }}
          >
            Note: Markdown formatting (**, *, etc.) has been converted to plain text for easy editing.
          </p>
        </div>
      ) : (
        <SummaryViewer 
          summary={summary} 
          title="Summary Preview"
        />
      )}

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between pt-4 sm:pt-6 gap-4">
        <button
          onClick={onPrevious}
          className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-md text-sm sm:text-base order-2 sm:order-1"
          style={{ 
            backgroundColor: colors.beige,
            color: colors.darkPurple
          }}
        >
          Back
        </button>
        <LoadingButton
          onClick={onNext}
          className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base order-1 sm:order-2"
          style={{ 
            backgroundColor: colors.darkBrown,
            color: 'white'
          }}
        >
          <span className="hidden sm:inline">Continue to Email</span>
          <span className="sm:hidden">Continue</span>
        </LoadingButton>
      </div>
    </div>
  )
}

export default EditStep
