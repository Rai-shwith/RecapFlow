import React, { useCallback } from 'react'
import { colors } from '../../utils/colors'
import { LoadingButton } from '../LoadingComponents'
import { 
  MdUpload, 
  MdCloudUpload, 
  MdDescription, 
  MdArrowForward,
  MdArrowBack 
} from 'react-icons/md'

const UploadStep = ({ 
  onFileUpload, 
  transcript, 
  setTranscript, 
  loading,
  onNext,
  onPrevious
}) => {
  // Drag and drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault()
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      onFileUpload(files[0])
    }
  }, [onFileUpload])

  return (
    <div className="space-y-6">
      <h2 
        className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center"
        style={{ color: colors.darkPurple }}
      >
        Upload Your Transcript
      </h2>
      
      {/* File Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-all duration-200 hover:shadow-md cursor-pointer"
        style={{ borderColor: colors.beige }}
      >
        <div className="space-y-4">
          <div 
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto flex items-center justify-center"
            style={{ backgroundColor: `${colors.gold}20` }}
          >
            <span className="text-xl sm:text-2xl">📄</span>
          </div>
          <div>
            <p 
              className="text-base sm:text-lg font-medium"
              style={{ color: colors.darkPurple }}
            >
              <span className="hidden sm:inline">Drag and drop your transcript file here</span>
              <span className="sm:hidden">Upload your transcript file</span>
            </p>
            <p 
              className="text-xs sm:text-sm mt-2"
              style={{ color: colors.brown }}
            >
              Supports .txt and .md files
            </p>
          </div>
          <label 
            className="inline-flex items-center px-6 py-3 rounded-lg font-medium cursor-pointer transition-all duration-200 hover:shadow-md"
            style={{ 
              backgroundColor: colors.gold,
              color: colors.darkPurple 
            }}
          >
            <input
              type="file"
              accept=".txt,.md"
              onChange={(e) => onFileUpload(e.target.files[0])}
              className="hidden"
              disabled={loading}
            />
            {loading ? 'Uploading...' : 'Choose File'}
          </label>
        </div>
      </div>

      {/* Or paste directly */}
      <div className="text-center">
        <p 
          className="text-sm font-medium mb-4"
          style={{ color: colors.brown }}
        >
          Or paste your transcript directly:
        </p>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste your meeting transcript here..."
          className="w-full h-24 sm:h-32 p-3 sm:p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 transition-all duration-200 text-sm sm:text-base"
          style={{ 
            borderColor: colors.beige,
            '--tw-ring-color': `${colors.gold}40`
          }}
          disabled={loading}
        />
      </div>

      {/* Character count */}
      {transcript && (
        <div className="text-center">
          <p 
            className="text-sm"
            style={{ color: colors.brown }}
          >
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
            backgroundColor: transcript.trim() ? colors.darkBrown : colors.beige,
            color: 'white'
          }}
        >
          <span className="hidden sm:inline">Continue to Summarize</span>
          <span className="sm:hidden">Continue</span>
        </LoadingButton>
      </div>
    </div>
  )
}

export default UploadStep
