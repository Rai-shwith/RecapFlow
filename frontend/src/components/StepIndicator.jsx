import React from 'react'
import { colors } from '../utils/colors'
import { 
  MdUpload, 
  MdAutoAwesome, 
  MdEdit, 
  MdEmail,
  MdCheck 
} from 'react-icons/md'

const stepIcons = {
  'Upload': MdUpload,
  'Summarize': MdAutoAwesome,
  'Edit': MdEdit,
  'Email': MdEmail
}

const StepIndicator = ({ steps, currentStep, onStepClick }) => (
  <div className="mb-8">
    {/* Desktop View */}
    <div className="hidden md:block">
      {/* Progress Bar Background */}
      <div className="relative mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-500 ease-out"
            style={{ 
              backgroundColor: colors.gold,
              width: `${(currentStep / (steps.length - 1)) * 100}%`
            }}
          />
        </div>
      </div>
      
      {/* Step Indicators */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const IconComponent = stepIcons[step] || MdCheck
          return (
            <div key={step} className="flex flex-col items-center">
              <button
                onClick={() => onStepClick && onStepClick(index)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-300 hover:scale-105 ${
                  index <= currentStep ? 'shadow-lg' : 'opacity-50'
                } ${onStepClick ? 'cursor-pointer' : 'cursor-default'}`}
                style={{ 
                  backgroundColor: index <= currentStep ? colors.darkBrown : colors.beige
                }}
                disabled={!onStepClick}
              >
                {index < currentStep ? (
                  <MdCheck className="text-lg" />
                ) : (
                  <IconComponent className="text-lg" />
                )}
              </button>
              <span 
                className={`mt-2 text-sm font-medium ${index <= currentStep ? 'opacity-100' : 'opacity-50'}`}
                style={{ color: colors.darkPurple }}
              >
                {step}
              </span>
            </div>
          )
        })}
      </div>
    </div>

    {/* Mobile View */}
    <div className="md:hidden">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-2" style={{ color: colors.darkPurple }}>
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-300"
            style={{ 
              backgroundColor: colors.gold,
              width: `${((currentStep + 1) / steps.length) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Current Step Display */}
      <div className="text-center">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2 shadow-lg"
          style={{ backgroundColor: colors.darkBrown }}
        >
          {currentStep + 1}
        </div>
        <h3 
          className="text-lg font-semibold"
          style={{ color: colors.darkPurple }}
        >
          {steps[currentStep]}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {currentStep === 0 && "Upload your meeting recording or transcript"}
          {currentStep === 1 && "Generate AI-powered summary"}
          {currentStep === 2 && "Review and edit your summary"}
          {currentStep === 3 && "Send summary via email"}
        </p>
      </div>

      {/* Mini Step Dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => onStepClick && onStepClick(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              onStepClick ? 'hover:scale-125' : ''
            }`}
            style={{ 
              backgroundColor: index <= currentStep ? colors.gold : colors.beige,
              opacity: index <= currentStep ? 1 : 0.4
            }}
          />
        ))}
      </div>
    </div>
  </div>
)

export default StepIndicator
