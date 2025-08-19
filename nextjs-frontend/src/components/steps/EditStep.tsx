import React from 'react';
import { colors } from '@/utils/colors';

interface EditStepProps {
  summary: string;
  editableSummary: string;
  setEditableSummary: (summary: string) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  onSaveEdit: () => void;
  loading: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

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
}: EditStepProps) => {
  return (
    <div className="space-y-6">
      <h2 
        className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center text-gray-800"
      >
        Edit Your Summary
      </h2>

      <div className="bg-blue-50 rounded-lg p-6 text-center">
        <div className="text-4xl mb-4">🚧</div>
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Edit Step Coming Soon
        </h3>
        <p className="text-blue-800 text-sm">
          Summary editing with markdown preview will be available here.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between pt-4 sm:pt-6 gap-4">
        <button
          onClick={onPrevious}
          className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-md text-sm sm:text-base order-2 sm:order-1 bg-gray-200 text-gray-700"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base order-1 sm:order-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md bg-blue-600 text-white"
        >
          Continue to Email
        </button>
      </div>
    </div>
  );
};

export default EditStep;
