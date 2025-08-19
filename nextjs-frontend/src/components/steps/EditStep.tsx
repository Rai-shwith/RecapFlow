import React, { useState, useEffect } from 'react';
import { MdEdit, MdPreview, MdSave, MdCancel } from 'react-icons/md';
import { marked } from 'marked';
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
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('preview');
  const [tempSummary, setTempSummary] = useState(editableSummary);

  // Update tempSummary when editableSummary changes
  useEffect(() => {
    setTempSummary(editableSummary);
  }, [editableSummary]);

  // Utility function to scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setViewMode('edit');
    setTempSummary(editableSummary);
    scrollToTop();
  };

  const handleSave = () => {
    setEditableSummary(tempSummary);
    setIsEditing(false);
    setViewMode('preview');
    onSaveEdit();
    scrollToTop();
  };

  const handleCancel = () => {
    setTempSummary(editableSummary);
    setIsEditing(false);
    setViewMode('preview');
    scrollToTop();
  };

  const renderMarkdown = (content: string) => {
    try {
      return marked(content);
    } catch (error) {
      console.error('Error rendering markdown:', error);
      return content;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-gray-800">
          Edit Your Summary
        </h2>
        <p className="text-gray-600 text-sm">
          Review and refine your summary before sending
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap gap-2 justify-center">
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <MdEdit className="text-lg" />
            Edit Summary
          </button>
        ) : (
          <>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('edit')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'edit'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <MdEdit className="text-lg" />
                Edit
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'preview'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <MdPreview className="text-lg" />
                Preview
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <MdSave className="text-lg" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                <MdCancel className="text-lg" />
                Cancel
              </button>
            </div>
          </>
        )}
      </div>

      {/* Content Area */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {isEditing && viewMode === 'edit' ? (
          /* Edit Mode - Show raw markdown with ** and * formatting */
          <div className="p-4">
            <textarea
              value={tempSummary}
              onChange={(e) => setTempSummary(e.target.value)}
              className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm text-gray-900 bg-white"
              placeholder="Edit your summary here... You can use markdown formatting."
            />
            <div className="mt-2 text-xs text-gray-500">
              💡 Tip: Use markdown formatting - **bold**, *italic*, - bullet points, etc.
            </div>
          </div>
        ) : (
          /* Preview Mode - Show rendered markdown with bold, italic, etc. */
          <div className="p-6">
            <div 
              className="prose prose-blue max-w-none markdown-content"
              dangerouslySetInnerHTML={{ 
                __html: renderMarkdown(isEditing ? tempSummary : editableSummary) 
              }}
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between pt-4 sm:pt-6 gap-4">
        <button
          onClick={onPrevious}
          className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-md text-sm sm:text-base order-2 sm:order-1 bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Back to Summary
        </button>
        <button
          onClick={onNext}
          disabled={isEditing}
          className={`px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base order-1 sm:order-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md ${
            isEditing 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Continue to Email
        </button>
      </div>
    </div>
  );
};

export default EditStep;
