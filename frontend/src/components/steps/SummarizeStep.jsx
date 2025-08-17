import React from 'react'
import { colors } from '../../utils/colors'
import { LoadingButton, LoadingBar } from '../LoadingComponents'
import SummaryViewer from '../SummaryViewer'

const SummarizeStep = ({ 
  transcript, 
  customPrompt, 
  setCustomPrompt, 
  summary, 
  onSummarize, 
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
        Generate AI Summary
      </h2>

      {/* Loading bar when generating */}
      {loading && (
        <div className="space-y-2">
          <LoadingBar />
          <p className="text-sm text-center" style={{ color: colors.brown }}>
            AI is analyzing your transcript...
          </p>
        </div>
      )}

      {/* Transcript Preview */}
      <div>
        <label 
          className="block text-sm font-medium mb-2"
          style={{ color: colors.darkBrown }}
        >
          Your Transcript ({transcript.length} characters):
        </label>
        <div 
          className="p-4 rounded-lg max-h-40 overflow-y-auto text-sm"
          style={{ backgroundColor: `${colors.beige}20` }}
        >
          {transcript}
        </div>
      </div>

      {/* Custom Prompt */}
      <div>
        <label 
          className="block text-sm font-medium mb-2"
          style={{ color: colors.darkBrown }}
        >
          Custom Instructions (Optional):
        </label>
        <textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="e.g., Focus on action items and decisions made..."
          className="w-full h-20 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 transition-all duration-200"
          style={{ 
            borderColor: colors.beige,
            '--tw-ring-color': `${colors.gold}40`
          }}
          disabled={loading}
        />
      </div>

      {/* Generated Summary */}
      {summary && (
        <SummaryViewer 
          summary={summary} 
          title="Generated Summary"
        />
      )}

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between pt-4 sm:pt-6 gap-4">
        <button
          onClick={onPrevious}
          disabled={loading}
          className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50 text-sm sm:text-base order-2 sm:order-1"
          style={{ 
            backgroundColor: colors.beige,
            color: colors.darkPurple
          }}
        >
          Back
        </button>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 order-1 sm:order-2">
          <LoadingButton
            onClick={onSummarize}
            loading={loading}
            disabled={!transcript.trim()}
            className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
            style={{ 
              backgroundColor: colors.gold,
              color: colors.darkPurple
            }}
          >
            <span className="hidden sm:inline">Generate Summary</span>
            <span className="sm:hidden">Generate</span>
          </LoadingButton>
          <LoadingButton
            onClick={onNext}
            disabled={!summary}
            className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
            style={{ 
              backgroundColor: summary ? colors.darkBrown : colors.beige,
              color: 'white'
            }}
          >
            <span className="hidden sm:inline">Continue to Edit</span>
            <span className="sm:hidden">Continue</span>
          </LoadingButton>
        </div>
      </div>
    </div>
  )
}

export default SummarizeStep
