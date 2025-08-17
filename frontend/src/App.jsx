import React, { useState } from 'react'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

// Component imports
import StepIndicator from './components/StepIndicator'
import { LoadingButton } from './components/LoadingComponents'
import UploadStep from './components/steps/UploadStep'
import SummarizeStep from './components/steps/SummarizeStep'
import EditStep from './components/steps/EditStep'
import EmailStep from './components/steps/EmailStep'

// Utility imports
import { colors } from './utils/colors'
import { markdownToPlainText, plainTextToMarkdown } from './utils/markdown'
import Config from './config'

// Icons
import { 
  MdError, 
  MdCheckCircle, 
  MdClose, 
  MdArrowBack, 
  MdArrowForward,
  MdAutoGraph
} from 'react-icons/md'

// Alert Message Component
const AlertMessage = ({ type, message, onClose }) => (
  <div className={`mb-6 border rounded-lg px-4 py-3 flex items-center gap-2 ${
    type === 'error' 
      ? 'bg-red-50 border-red-200 text-red-700' 
      : 'bg-green-50 border-green-200 text-green-700'
  }`}>
    {type === 'error' ? (
      <MdError className="w-5 h-5 text-red-500" />
    ) : (
      <MdCheckCircle className="w-5 h-5 text-green-500" />
    )}
    <span className="flex-1">{message}</span>
    <button 
      onClick={onClose}
      className={`${type === 'error' ? 'text-red-400 hover:text-red-600' : 'text-green-400 hover:text-green-600'} transition-colors`}
    >
      <MdClose className="w-4 h-4" />
    </button>
  </div>
)

// Quick Navigation Component
const QuickNavigation = ({ currentStep, steps, onPrevious, onNext, loading }) => (
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
      disabled={currentStep === steps.length - 1}
      variant="primary"
      loading={loading}
      className="px-3 sm:px-4 py-2 text-sm sm:text-base flex items-center gap-2"
    >
      <span className="hidden sm:inline">Next</span>
      <span className="sm:hidden">Next</span>
      <MdArrowForward className="text-lg" />
    </LoadingButton>
  </div>
)

function App() {
  // Wizard state
  const [currentStep, setCurrentStep] = useState(0)
  const steps = ['Upload', 'Summarize', 'Edit', 'Email']
  
  // Main application state
  const [transcript, setTranscript] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')
  const [summary, setSummary] = useState('')
  const [editableSummary, setEditableSummary] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  
  // Email state
  const [emailRecipients, setEmailRecipients] = useState([])
  const [emailSubject, setEmailSubject] = useState('Meeting Summary - RecapFlow')
  const [includeTranscript, setIncludeTranscript] = useState(false)
  
  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // API Configuration from environment
  const API_BASE = Config.API_BASE_URL

  // File upload handler
  const handleFileUpload = async (file) => {
    if (!file) return
    
    const formData = new FormData()
    formData.append('file', file)
    
    setLoading(true)
    setError('')
    clearMessages()
    
    // Show loading toast
    const loadingToast = toast.loading('📁 Uploading file...', {
      style: {
        borderRadius: '10px',
        background: colors.darkPurple,
        color: '#fff',
      },
    })
    
    try {
      const response = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setTranscript(response.data.transcript)
      
      // Success toast
      toast.success('📄 File uploaded successfully!', {
        id: loadingToast,
        style: {
          borderRadius: '10px',
          background: '#10B981',
          color: '#fff',
        },
        duration: 3000,
      })
      setSuccess('File uploaded successfully!')
    } catch (err) {
      // Error toast
      toast.error(`❌ Upload failed: ${err.response?.data?.detail || err.message}`, {
        id: loadingToast,
        style: {
          borderRadius: '10px',
          background: '#EF4444',
          color: '#fff',
        },
        duration: 4000,
      })
      setError(`Upload failed: ${err.response?.data?.detail || err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Summarize transcript
  const handleSummarize = async () => {
    if (!transcript.trim()) {
      toast.error('📝 Please provide a transcript first', {
        style: {
          borderRadius: '10px',
          background: '#EF4444',
          color: '#fff',
        },
        duration: 3000,
      })
      setError('Please provide a transcript first')
      return
    }
    
    setLoading(true)
    setError('')
    clearMessages()
    
    // Show loading toast
    const loadingToast = toast.loading('🤖 AI is generating your summary...', {
      style: {
        borderRadius: '10px',
        background: colors.darkPurple,
        color: '#fff',
      },
    })
    
    try {
      const response = await axios.post(`${API_BASE}/summarize`, {
        transcript,
        custom_prompt: customPrompt || null
      })
      setSummary(response.data.summary)
      setEditableSummary(markdownToPlainText(response.data.summary))
      
      // Success toast
      toast.success(`✨ Summary generated in ${response.data.processing_time?.toFixed(2)}s!`, {
        id: loadingToast,
        style: {
          borderRadius: '10px',
          background: '#10B981',
          color: '#fff',
        },
        duration: 4000,
      })
      setSuccess(`Summary generated in ${response.data.processing_time?.toFixed(2)}s`)
    } catch (err) {
      // Error toast
      toast.error(`🚨 Summarization failed: ${err.response?.data?.detail || err.message}`, {
        id: loadingToast,
        style: {
          borderRadius: '10px',
          background: '#EF4444',
          color: '#fff',
        },
        duration: 4000,
      })
      setError(`Summarization failed: ${err.response?.data?.detail || err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Save edited summary
  const handleSaveEdit = () => {
    const markdownSummary = plainTextToMarkdown(editableSummary)
    setSummary(markdownSummary)
    setIsEditing(false)
    setSuccess('Summary updated successfully!')
  }

  // Send email
  const handleSendEmail = async (emailData) => {
    if (emailRecipients.length === 0) {
      toast.error('📧 Please add at least one recipient', {
        style: {
          borderRadius: '10px',
          background: '#EF4444',
          color: '#fff',
        },
        duration: 3000,
      })
      setError('Please add at least one recipient')
      return
    }
    
    setLoading(true)
    setError('')
    clearMessages()
    
    // Show loading toast
    const loadingToast = toast.loading('📧 Sending your email...', {
      style: {
        borderRadius: '10px',
        background: colors.darkPurple,
        color: '#fff',
      },
    })
    
    try {
      // Use emailData if provided, otherwise use existing summary
      const emailContent = emailData?.emailContent || summary
      
      const response = await axios.post(`${API_BASE}/send-email`, {
        recipients: emailRecipients,
        summary: emailContent,
        subject: emailSubject,
        include_transcript: includeTranscript,
        original_transcript: includeTranscript ? transcript : null,
        sender_details: emailData?.senderDetails || null
      })
      
      // Success toast
      toast.success(`📨 Email sent successfully to ${emailRecipients.length} recipient${emailRecipients.length > 1 ? 's' : ''}!`, {
        id: loadingToast,
        style: {
          borderRadius: '10px',
          background: '#10B981',
          color: '#fff',
        },
        duration: 4000,
      })
      setSuccess(`Email sent successfully to ${emailRecipients.length} recipients!`)
    } catch (err) {
      // Error toast
      toast.error(`🚨 Email sending failed: ${err.response?.data?.detail || err.message}`, {
        id: loadingToast,
        style: {
          borderRadius: '10px',
          background: '#EF4444',
          color: '#fff',
        },
        duration: 4000,
      })
      setError(`Email sending failed: ${err.response?.data?.detail || err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Navigation functions
  const nextStep = () => {
    clearMessages()
    setCurrentStep(Math.min(currentStep + 1, steps.length - 1))
  }
  const prevStep = () => {
    clearMessages()
    setCurrentStep(Math.max(currentStep - 1, 0))
  }
  const goToStep = (step) => {
    clearMessages()
    setCurrentStep(step)
  }

  // Clear success/error messages
  const clearMessages = () => {
    setTimeout(() => {
      setError('')
      setSuccess('')
    }, 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <MdAutoGraph className="text-4xl sm:text-5xl text-blue-600" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              RecapFlow
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600">Transform meetings into insights in minutes</p>
        </div>

        {/* Alert Messages */}
        {(error || success) && (
          <AlertMessage 
            type={error ? 'error' : 'success'} 
            message={error || success} 
            onClose={() => {
              setError('')
              setSuccess('')
            }}
          />
        )}

        {/* Step Indicator */}
        <StepIndicator 
          steps={steps}
          currentStep={currentStep}
          onStepClick={goToStep}
        />

        {/* Quick Navigation */}
        <QuickNavigation 
          currentStep={currentStep}
          steps={steps}
          onPrevious={prevStep}
          onNext={nextStep}
          loading={loading}
        />

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden p-4 sm:p-6 lg:p-8">
          {currentStep === 0 && (
            <UploadStep 
              onFileUpload={handleFileUpload}
              transcript={transcript}
              setTranscript={setTranscript}
              loading={loading}
              onNext={nextStep}
              onPrevious={prevStep}
            />
          )}

          {currentStep === 1 && (
            <SummarizeStep 
              transcript={transcript}
              customPrompt={customPrompt}
              setCustomPrompt={setCustomPrompt}
              summary={summary}
              onSummarize={handleSummarize}
              loading={loading}
              onNext={nextStep}
              onPrevious={prevStep}
            />
          )}

          {currentStep === 2 && (
            <EditStep 
              summary={summary}
              editableSummary={editableSummary}
              setEditableSummary={setEditableSummary}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              onSaveEdit={handleSaveEdit}
              loading={loading}
              onNext={nextStep}
              onPrevious={prevStep}
            />
          )}

          {currentStep === 3 && (
            <EmailStep 
              emailRecipients={emailRecipients}
              setEmailRecipients={setEmailRecipients}
              emailSubject={emailSubject}
              setEmailSubject={setEmailSubject}
              includeTranscript={includeTranscript}
              setIncludeTranscript={setIncludeTranscript}
              summary={summary}
              transcript={transcript}
              onSendEmail={handleSendEmail}
              loading={loading}
              onNext={nextStep}
              onPrevious={prevStep}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2024 RecapFlow • Built with ❤️ for better meetings</p>
        </div>
      </div>
      <Toaster />
    </div>
  )
}

export default App
