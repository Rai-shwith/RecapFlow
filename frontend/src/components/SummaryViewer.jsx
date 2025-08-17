import React from 'react'
import { marked } from 'marked'
import { colors } from '../utils/colors'

const SummaryViewer = ({ summary, title = "Summary", className = "" }) => {
  if (!summary) return null

  return (
    <div className={`space-y-3 ${className}`}>
      <label 
        className="block text-sm font-medium"
        style={{ color: colors.darkBrown }}
      >
        {title}:
      </label>
      <div 
        className="p-6 rounded-lg border"
        style={{ 
          backgroundColor: `${colors.gold}10`,
          borderColor: `${colors.gold}30`
        }}
      >
        <div 
          className="prose prose-sm max-w-none text-left"
          style={{ 
            color: colors.darkPurple,
            '--tw-prose-headings': colors.darkPurple,
            '--tw-prose-bold': colors.darkBrown,
            '--tw-prose-bullets': colors.brown,
          }}
          dangerouslySetInnerHTML={{ __html: marked(summary) }}
        />
      </div>
    </div>
  )
}

export default SummaryViewer
