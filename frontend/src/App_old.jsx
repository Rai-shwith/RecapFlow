import { useState } from 'react'
import axios from 'axios'
import { marked } from 'marked'
import './App.css'

// Import components
import StepIndicator from './components/StepIndicator'
import AlertMessage from './components/AlertMessage'
import QuickNavigation from './components/QuickNavigation'
import UploadStep from './components/steps/UploadStep'
import SummarizeStep from './components/steps/SummarizeStep'
import EditStep from './components/steps/EditStep'
import EmailStep from './components/steps/EmailStep'

// Import utilities
import { colors } from './utils/colors'
import { markdownToPlainText, plainTextToMarkdown } from './utils/markdown'

// Configure marked for safe rendering
marked.setOptions({
  breaks: true,
  gfm: true,
  sanitize: false
})

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
  
  const API_BASE = 'http://localhost:8000'

  // File upload handler
  const handleFileUpload = async (file) => {
    if (!file) return
    
    const formData = new FormData()
    formData.append('file', file)
    
    setLoading(true)
    setError('')
    clearMessages()
    
    try {
      const response = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setTranscript(response.data.transcript)
      setSuccess('File uploaded successfully!')
    } catch (err) {
      setError(`Upload failed: ${err.response?.data?.detail || err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Summarize transcript
  const handleSummarize = async () => {
    if (!transcript.trim()) {
      setError('Please provide a transcript first')
      return
    }
    
    setLoading(true)
    setError('')
    clearMessages()
    
    try {
      const response = await axios.post(`${API_BASE}/summarize`, {
        transcript,
        custom_prompt: customPrompt || null
      })
      setSummary(response.data.summary)
      setEditableSummary(markdownToPlainText(response.data.summary))
      setSuccess(`Summary generated in ${response.data.processing_time?.toFixed(2)}s`)
    } catch (err) {
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
  const handleSendEmail = async () => {
    if (emailRecipients.length === 0) {
      setError('Please add at least one recipient')
      return
    }
    
    setLoading(true)
    setError('')
    clearMessages()
    
    try {
      const response = await axios.post(`${API_BASE}/send-email`, {
        recipients: emailRecipients,
        summary,
        subject: emailSubject,
        include_transcript: includeTranscript,
        original_transcript: includeTranscript ? transcript : null
      })
      setSuccess(`Email sent successfully to ${emailRecipients.length} recipients!`)
    } catch (err) {
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

  const testSummarization = async () => {
    if (!transcript.trim()) {
      setApiResponse({ error: 'Please enter a transcript to summarize' })
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/summarize`, {
        transcript: transcript.trim(),
        custom_prompt: customPrompt.trim() || null
      })
      setSummary(response.data.summary)
      setApiResponse(response.data)
    } catch (error) {
      setApiResponse({ error: error.response?.data?.detail || 'Summarization failed' })
    } finally {
      setLoading(false)
    }
  }

  const testEmailSending = async () => {
    if (!summary.trim() || !recipients.trim()) {
      setApiResponse({ error: 'Please provide both summary and recipient emails' })
      return
    }

    setLoading(true)
    try {
      const emailList = recipients.split(',').map(email => email.trim()).filter(email => email)
      const response = await axios.post(`${API_BASE_URL}/send-email`, {
        recipients: emailList,
        summary: summary.trim(),
        subject: "Test Summary from RecapFlow",
        include_transcript: false
      })
      setApiResponse(response.data)
    } catch (error) {
      setApiResponse({ error: error.response?.data?.detail || 'Email sending failed' })
    } finally {
      setLoading(false)
    }
  }

  const testFileUpload = async () => {
    if (!selectedFile) {
      setApiResponse({ error: 'Please select a file to upload' })
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      if (response.data.transcript) {
        setTranscript(response.data.transcript)
      }
      setApiResponse(response.data)
    } catch (error) {
      setApiResponse({ error: error.response?.data?.detail || 'File upload failed' })
    } finally {
      setLoading(false)
    }
  }

  const testRephrase = async (style) => {
    if (!summary.trim()) {
      setApiResponse({ error: 'No summary to rephrase' })
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/rephrase`, {
        summary: summary,
        style: style
      })
      setSummary(response.data.rephrased_summary)
      setApiResponse(response.data)
    } catch (error) {
      setApiResponse({ error: error.response?.data?.detail || 'Rephrase failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen py-8 px-4"
      style={{ backgroundColor: `${colors.beige}10` }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 
            className="text-4xl font-bold mb-4"
            style={{ color: colors.darkPurple }}
          >
            🔄 RecapFlow
          </h1>
          <p 
            className="text-lg"
            style={{ color: colors.darkBrown }}
          >
            AI-powered transcript summarization and sharing
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator steps={steps} currentStep={currentStep} />

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        {success && (
          <div 
            className="border rounded-lg p-4 mb-6"
            style={{ 
              backgroundColor: `${colors.gold}10`,
              borderColor: `${colors.gold}50`
            }}
          >
            <p style={{ color: colors.darkBrown }}>{success}</p>
          </div>
        )}

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          
          {/* Step 0: Upload */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <h2 
                className="text-2xl font-semibold mb-6"
                style={{ color: colors.darkPurple }}
              >
                Upload Your Transcript
              </h2>
              
              {/* File Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 hover:shadow-md cursor-pointer"
                style={{ borderColor: colors.beige }}
              >
                <div className="space-y-4">
                  <div 
                    className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
                    style={{ backgroundColor: `${colors.gold}20` }}
                  >
                    <span className="text-2xl">📄</span>
                  </div>
                  <div>
                    <p 
                      className="text-lg font-medium"
                      style={{ color: colors.darkPurple }}
                    >
                      Drag and drop your transcript file here
                    </p>
                    <p 
                      className="text-sm mt-2"
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
                      onChange={(e) => handleFileUpload(e.target.files[0])}
                      className="hidden"
                    />
                    Choose File
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
                  className="w-full h-32 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{ 
                    borderColor: colors.beige,
                    '--tw-ring-color': `${colors.gold}40`
                  }}
                />
              </div>

              {/* Navigation */}
              <div className="flex justify-end pt-6">
                <button
                  onClick={nextStep}
                  disabled={!transcript.trim()}
                  className="px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: transcript.trim() ? colors.darkBrown : colors.beige,
                    color: 'white'
                  }}
                >
                  Continue to Summarize
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Summarize */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 
                className="text-2xl font-semibold mb-6"
                style={{ color: colors.darkPurple }}
              >
                Generate AI Summary
              </h2>

              {/* Transcript Preview */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.darkBrown }}
                >
                  Your Transcript ({transcript.length} characters):
                </label>
                <div 
                  className="p-4 rounded-lg max-h-40 overflow-y-auto text-sm"
                  style={{ backgroundColor: `${colors.beige}20` }}
                >
                  {transcript}
                </div>
              </div>

              {/* Custom Prompt */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.darkBrown }}
                >
                  Custom Instructions (Optional):
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g., Focus on action items and decisions made..."
                  className="w-full h-20 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{ 
                    borderColor: colors.beige,
                    '--tw-ring-color': `${colors.gold}40`
                  }}
                />
              </div>

              {/* Generated Summary */}
              {summary && (
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.darkBrown }}
                  >
                    Generated Summary:
                  </label>
                  <div 
                    className="p-4 rounded-lg prose prose-sm max-w-none "
                    style={{ backgroundColor: `${colors.gold}10` }}
                    dangerouslySetInnerHTML={{ __html: marked(summary) }}
                  />
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
                  style={{ 
                    backgroundColor: colors.beige,
                    color: colors.darkPurple
                  }}
                >
                  Back
                </button>
                <div className="flex gap-4">
                  <button
                    onClick={handleSummarize}
                    disabled={loading || !transcript.trim()}
                    className="px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50"
                    style={{ 
                      backgroundColor: colors.gold,
                      color: colors.darkPurple
                    }}
                  >
                    {loading ? 'Generating...' : 'Generate Summary'}
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!summary}
                    className="px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50"
                    style={{ 
                      backgroundColor: summary ? colors.darkBrown : colors.beige,
                      color: 'white'
                    }}
                  >
                    Continue to Edit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Edit */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 
                className="text-2xl font-semibold mb-6"
                style={{ color: colors.darkPurple }}
              >
                Edit Your Summary
              </h2>

              {/* Edit Mode Toggle */}
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
                  style={{ 
                    backgroundColor: isEditing ? colors.darkBrown : colors.gold,
                    color: isEditing ? 'white' : colors.darkPurple
                  }}
                >
                  {isEditing ? 'Preview' : 'Edit'}
                </button>
                {isEditing && (
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
                    style={{ 
                      backgroundColor: colors.brown,
                      color: 'white'
                    }}
                  >
                    Save Changes
                  </button>
                )}
              </div>

              {/* Edit Area */}
              {isEditing ? (
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.darkBrown }}
                  >
                    Edit Summary (plain text):
                  </label>
                  <textarea
                    value={editableSummary}
                    onChange={(e) => setEditableSummary(e.target.value)}
                    className="w-full h-64 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 transition-all duration-200 font-mono text-sm"
                    style={{ 
                      borderColor: colors.beige,
                      '--tw-ring-color': `${colors.gold}40`
                    }}
                  />
                  <p 
                    className="text-xs mt-2"
                    style={{ color: colors.brown }}
                  >
                    Note: Markdown formatting (**, *, etc.) has been converted to plain text for easy editing.
                  </p>
                </div>
              ) : (
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.darkBrown }}
                  >
                    Summary Preview:
                  </label>
                  <div 
                    className="p-4 rounded-lg prose prose-sm max-w-none"
                    style={{ backgroundColor: `${colors.gold}10` }}
                    dangerouslySetInnerHTML={{ __html: marked(summary) }}
                  />
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
                  style={{ 
                    backgroundColor: colors.beige,
                    color: colors.darkPurple
                  }}
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
                  style={{ 
                    backgroundColor: colors.darkBrown,
                    color: 'white'
                  }}
                >
                  Continue to Email
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Email */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 
                className="text-2xl font-semibold mb-6"
                style={{ color: colors.darkPurple }}
              >
                Send Summary via Email
              </h2>

              {/* Email Recipients */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.darkBrown }}
                >
                  Recipients:
                </label>
                <EmailInput
                  emails={emailRecipients}
                  setEmails={setEmailRecipients}
                  placeholder="Enter email addresses (separate with comma or space)"
                />
                <p 
                  className="text-xs mt-2"
                  style={{ color: colors.brown }}
                >
                  Tip: Type email and press comma, space, or enter to add. Click emails to edit them.
                </p>
              </div>

              {/* Email Subject */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.darkBrown }}
                >
                  Subject:
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{ 
                    borderColor: colors.beige,
                    '--tw-ring-color': `${colors.gold}40`
                  }}
                />
              </div>

              {/* Include Transcript Option */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="includeTranscript"
                  checked={includeTranscript}
                  onChange={(e) => setIncludeTranscript(e.target.checked)}
                  className="w-4 h-4 rounded focus:ring-2"
                  style={{ 
                    accentColor: colors.gold
                  }}
                />
                <label 
                  htmlFor="includeTranscript"
                  className="text-sm font-medium cursor-pointer"
                  style={{ color: colors.darkBrown }}
                >
                  Include original transcript in email
                </label>
              </div>

              {/* Email Preview */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.darkBrown }}
                >
                  Email Preview:
                </label>
                <div 
                  className="p-4 rounded-lg border max-h-64 overflow-y-auto"
                  style={{ 
                    backgroundColor: `${colors.beige}10`,
                    borderColor: colors.beige
                  }}
                >
                  <div className="space-y-3">
                    <div>
                      <strong>To:</strong> {emailRecipients.join(', ') || 'No recipients'}
                    </div>
                    <div>
                      <strong>Subject:</strong> {emailSubject}
                    </div>
                    <div>
                      <strong>Summary:</strong>
                      <div 
                        className="mt-2 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: marked(summary) }}
                      />
                    </div>
                    {includeTranscript && (
                      <div>
                        <strong>Original Transcript:</strong>
                        <div className="mt-2 text-sm italic">
                          {transcript.substring(0, 200)}...
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
                  style={{ 
                    backgroundColor: colors.beige,
                    color: colors.darkPurple
                  }}
                >
                  Back
                </button>
                <button
                  onClick={handleSendEmail}
                  disabled={loading || emailRecipients.length === 0}
                  className="px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50"
                  style={{ 
                    backgroundColor: emailRecipients.length > 0 ? colors.darkBrown : colors.beige,
                    color: 'white'
                  }}
                >
                  {loading ? 'Sending...' : `Send Email${emailRecipients.length > 1 ? `s (${emailRecipients.length})` : ''}`}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Quick Navigation */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: `${colors.beige}20` }}>
            {steps.map((step, index) => (
              <button
                key={step}
                onClick={() => goToStep(index)}
                disabled={index > 0 && (index === 1 && !transcript) || (index === 2 && !summary) || (index === 3 && !summary)}
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

        {/* Footer */}
        <div className="text-center mt-12 pb-8">
          <p 
            className="text-sm"
            style={{ color: colors.brown }}
          >
            Made with ❤️ using React, FastAPI, and Google Gemini AI
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
