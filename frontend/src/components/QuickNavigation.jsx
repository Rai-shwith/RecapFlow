import React from 'react'
import { colors } from '../utils/colors'

const QuickNavigation = ({ steps, currentStep, goToStep, transcript, summary }) => {
  const isStepDisabled = (index) => {
    if (index === 0) return false
    if (index === 1) return !transcript
    if (index === 2) return !summary
    if (index === 3) return !summary
    return false
  }

  return (
    <div className="mt-8 text-center">
      <div className="inline-flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: `${colors.beige}20` }}>
        {steps.map((step, index) => (
          <button
            key={step}
            onClick={() => goToStep(index)}
            disabled={isStepDisabled(index)}
            className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              index === currentStep ? 'shadow-md' : 'hover:shadow-sm'
            }`}
            style={{ 
              backgroundColor: index === currentStep ? colors.gold : 'transparent',
              color: index === currentStep ? colors.darkPurple : colors.brown
            }}
          >
            {step}
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickNavigation
