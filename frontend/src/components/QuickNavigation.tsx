import React from 'react';
import { colors } from '@/utils/colors';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';
interface LoadingButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  style?: React.CSSProperties;
}

export const LoadingButton = ({ 
  onClick, 
  disabled = false, 
  loading = false, 
  children, 
  variant = 'primary',
  className = '',
  style = {}
}: LoadingButtonProps) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variantStyles = {
    primary: { 
      backgroundColor: colors.primary,
      color: 'white'
    },
    secondary: { 
      backgroundColor: colors.gray[200],
      color: colors.gray[700]
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${className}`}
      style={{ ...variantStyles[variant], ...style }}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

interface QuickNavigationProps {
  currentStep: number;
  steps: string[];
  onPrevious: () => void;
  onNext: () => void;
  loading: boolean;
  canProceedToNext?: boolean;
}

const QuickNavigation = ({ 
  currentStep, 
  steps, 
  onPrevious, 
  onNext, 
  loading,
  canProceedToNext = true
}: QuickNavigationProps) => (
  <div className="mb-6 flex justify-center gap-2 sm:gap-4">
    <LoadingButton
      onClick={onPrevious}
      disabled={currentStep === 0}
      variant="secondary"
      loading={false}
      className="px-3 sm:px-4 py-2 text-sm sm:text-base flex items-center gap-2"
    >
      <MdArrowBack className="text-lg" />
      <span className="hidden sm:inline">Previous</span>
      <span className="sm:hidden">Back</span>
    </LoadingButton>
    <LoadingButton
      onClick={onNext}
      disabled={currentStep === steps.length - 1 || !canProceedToNext}
      variant="primary"
      loading={loading}
      className="px-3 sm:px-4 py-2 text-sm sm:text-base flex items-center gap-2"
    >
      <span className="hidden sm:inline">Next</span>
      <span className="sm:hidden">Next</span>
      <MdArrowForward className="text-lg" />
    </LoadingButton>
  </div>
);

export default QuickNavigation;
