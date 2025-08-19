import React, { useCallback } from 'react';
import { colors } from '@/utils/colors';
import { LoadingButton } from '../QuickNavigation';
import { 
  MdUpload, 
  MdCloudUpload, 
  MdDescription, 
  MdArrowForward,
  MdArrowBack 
} from 'react-icons/md';

interface UploadStepProps {
  onFileUpload: (file: File) => void;
  transcript: string;
  setTranscript: (transcript: string) => void;
  loading: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

const UploadStep = ({ 
  onFileUpload, 
  transcript, 
  setTranscript, 
  loading,
  onNext,
  onPrevious
}: UploadStepProps) => {
  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileUpload(files[0]);
    }
  }, [onFileUpload]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <h2 
        className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center text-gray-800"
      >
        Upload Your Transcript
      </h2>
      
      {/* File Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-all duration-200 hover:shadow-md cursor-pointer border-blue-200 hover:border-blue-300"
      >
        <div className="space-y-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto flex items-center justify-center bg-blue-50">
            <span className="text-xl sm:text-2xl">📄</span>
          </div>
          <div>
            <p className="text-base sm:text-lg font-medium text-gray-800">
              <span className="hidden sm:inline">Drag and drop your transcript file here</span>
              <span className="sm:hidden">Upload your transcript file</span>
            </p>
            <p 
              className="text-sm text-gray-500 mt-1"
            >
              Supports .txt, .md, and .docx files
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center justify-center">
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".txt,.md,.docx"
                onChange={handleFileSelect}
                className="hidden"
                disabled={loading}
              />
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white">
                <MdCloudUpload className="text-lg" />
                <span>Choose File</span>
              </div>
            </label>
            <span className="text-xs sm:text-sm text-gray-400">or</span>
            <p className="text-xs sm:text-sm text-gray-600">
              paste text below
            </p>
          </div>
        </div>
      </div>

      {/* Manual Text Input */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-700">
          <MdDescription className="text-lg" />
          Or paste your transcript here:
        </label>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste your meeting transcript here..."
          className="w-full h-24 sm:h-32 p-3 sm:p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base text-gray-900 bg-white placeholder-gray-500"
          disabled={loading}
        />
      </div>

      {/* Character count */}
      {transcript && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {transcript.length} characters
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-end pt-4 sm:pt-6">
        <LoadingButton
          onClick={onNext}
          disabled={!transcript.trim()}
          className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
          style={{ 
            backgroundColor: transcript.trim() ? colors.primary : colors.gray[300],
            color: 'white'
          }}
        >
          <span className="hidden sm:inline">Continue to Summarize</span>
          <span className="sm:hidden">Continue</span>
        </LoadingButton>
      </div>
    </div>
  );
};

export default UploadStep;
