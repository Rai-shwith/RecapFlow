import React from 'react';
import { colors } from '@/utils/colors';
import { 
  MdUpload, 
  MdAutoAwesome, 
  MdEdit, 
  MdEmail,
  MdCheck 
} from 'react-icons/md';

const stepIcons = {
  'Upload': MdUpload,
  'Summarize': MdAutoAwesome,
  'Edit': MdEdit,
  'Email': MdEmail
};

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

const StepIndicator = ({ steps, currentStep, onStepClick }: StepIndicatorProps) => (
  <div className="mb-8">
    {/* Desktop View */}
    <div className="hidden md:block">
      {/* Progress Bar Background */}
      <div className="relative mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-500 ease-out"
            style={{ 
              backgroundColor: colors.primary,
              width: `${(currentStep / (steps.length - 1)) * 100}%`
            }}
          />
        </div>
      </div>
      
      {/* Step Indicators */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const IconComponent = stepIcons[step as keyof typeof stepIcons];
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = onStepClick && (index <= currentStep);
          
          return (
            <div key={step} className="flex flex-col items-center">
              <button
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg transition-all duration-200 ${
                  isClickable ? 'hover:shadow-xl cursor-pointer' : 'cursor-not-allowed'
                }`}
                style={{
                  backgroundColor: isCompleted || isCurrent ? colors.primary : colors.gray[300]
                }}
              >
                {isCompleted ? (
                  <MdCheck className="text-xl" />
                ) : IconComponent ? (
                  <IconComponent className="text-xl" />
                ) : (
                  index + 1
                )}
              </button>
              <span 
                className="text-sm font-medium mt-2"
                style={{ 
                  color: isCompleted || isCurrent ? colors.gray[800] : colors.gray[500]
                }}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>

    {/* Mobile View */}
    <div className="md:hidden">
      {/* Current Step Display */}
      <div className="text-center mb-6">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2 shadow-lg"
          style={{ backgroundColor: colors.primary }}
        >
          {currentStep + 1}
        </div>
        <h3 
          className="text-lg font-semibold"
          style={{ color: colors.gray[800] }}
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
            disabled={!onStepClick || index > currentStep}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index <= currentStep ? 'opacity-100' : 'opacity-30'
            }`}
            style={{
              backgroundColor: index <= currentStep ? colors.primary : colors.gray[300]
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

export default StepIndicator;
