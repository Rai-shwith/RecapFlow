import { useState, useEffect } from 'react'
import axios from 'axios'
import { marked } from 'marked'

const API_BASE_URL = 'http://localhost:8000'

// Component for rendering markdown text
const MarkdownRenderer = ({ content, className }) => {
  const getMarkdownHtml = () => {
    return { __html: marked(content || '') }
  }

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={getMarkdownHtml()}
    />
  )
}

function App() {
  const [apiResponse, setApiResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')
  const [summary, setSummary] = useState('')
  const [recipients, setRecipients] = useState('')
  const [activeTab, setActiveTab] = useState('test')
  const [selectedFile, setSelectedFile] = useState(null)

  const testBackendConnection = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/`)
      setApiResponse(response.data)
    } catch (error) {
      setApiResponse({ error: 'Failed to connect to backend' })
    } finally {
      setLoading(false)
    }
  }

  const testHealthCheck = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/health`)
      setApiResponse(response.data)
    } catch (error) {
      setApiResponse({ error: 'Health check failed' })
    } finally {
      setLoading(false)
    }
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

  const sampleTranscript = `Meeting Transcript - Product Planning Session
Date: August 16, 2025

John: Good morning everyone. Let's start our product planning session for Q4.

Sarah: Thanks John. I've prepared the market analysis. Our competitors are focusing heavily on AI integration.

Mike: From the engineering side, we can definitely implement AI features, but we'll need at least 3 months for proper testing.

Sarah: That aligns with our Q4 timeline. What about the budget requirements?

John: The budget committee approved $200K for AI development. We should prioritize the most impactful features first.

Mike: I suggest we start with automated content generation and smart recommendations.

Sarah: Agreed. Those features showed the highest user interest in our surveys.

John: Great. Let's plan for a prototype by September 15th and full rollout by November.

Action Items:
- Mike to create technical specifications by August 30th
- Sarah to coordinate with marketing for launch strategy
- John to schedule monthly check-ins with stakeholders`

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🔄 RecapFlow
          </h1>
          <p className="text-gray-600">
            AI-powered transcript summarization and sharing platform
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'test', label: 'API Tests' },
            { id: 'upload', label: 'File Upload' },
            { id: 'summarize', label: 'Summarization' },
            { id: 'email', label: 'Email Test' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md">
          {/* API Tests Tab */}
          {activeTab === 'test' && (
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Backend API Tests</h2>
              
              <div className="space-y-4">
                <button
                  onClick={testBackendConnection}
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-md transition-colors mr-4"
                >
                  {loading ? 'Testing...' : 'Test Root Endpoint'}
                </button>

                <button
                  onClick={testHealthCheck}
                  disabled={loading}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-6 py-2 rounded-md transition-colors"
                >
                  {loading ? 'Testing...' : 'Test Health Check'}
                </button>
              </div>

              {apiResponse && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h3 className="font-medium mb-2">API Response:</h3>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(apiResponse, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* File Upload Tab */}
          {activeTab === 'upload' && (
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">File Upload Test</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Transcript File (.txt or .md):
                  </label>
                  <input
                    type="file"
                    accept=".txt,.md"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {selectedFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>

                <button
                  onClick={testFileUpload}
                  disabled={loading || !selectedFile}
                  className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-6 py-2 rounded-md transition-colors"
                >
                  {loading ? 'Uploading...' : 'Upload & Extract Text'}
                </button>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h3 className="font-medium text-blue-800 mb-2">📁 Create Test File:</h3>
                  <p className="text-blue-700 text-sm">
                    Create a .txt file with meeting transcript content to test the upload feature.
                    The uploaded text will automatically populate the summarization tab.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Summarization Tab */}
          {activeTab === 'summarize' && (
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">AI Summarization Test</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transcript Text:
                  </label>
                  <textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Enter meeting transcript here..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => setTranscript(sampleTranscript)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Use Sample Transcript
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Prompt (Optional):
                  </label>
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g., 'Create executive summary with action items'"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={testSummarization}
                  disabled={loading || !transcript.trim()}
                  className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white px-6 py-2 rounded-md transition-colors"
                >
                  {loading ? 'Generating Summary...' : 'Generate AI Summary'}
                </button>

                {summary && (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                      <h3 className="font-medium text-green-800 mb-2">Generated Summary:</h3>
                      <MarkdownRenderer 
                        content={summary} 
                        className="text-green-700 prose prose-sm max-w-none"
                      />
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Test Rephrase Styles:</h3>
                      <div className="flex space-x-2">
                        {['professional', 'casual', 'technical', 'executive'].map(style => (
                          <button
                            key={style}
                            onClick={() => testRephrase(style)}
                            disabled={loading}
                            className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            {style.charAt(0).toUpperCase() + style.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Email Test Tab */}
          {activeTab === 'email' && (
            <div className="p-6">
              <h2 className="text-2xl font-semibent mb-4">Email Sending Test</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Summary to Send:
                  </label>
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Generate a summary first or enter text manually..."
                    className="w-full h-24 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Emails (comma-separated):
                  </label>
                  <input
                    type="text"
                    value={recipients}
                    onChange={(e) => setRecipients(e.target.value)}
                    placeholder="test@example.com, user@domain.com"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={testEmailSending}
                  disabled={loading || !summary.trim() || !recipients.trim()}
                  className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-6 py-2 rounded-md transition-colors"
                >
                  {loading ? 'Sending Email...' : 'Send Test Email'}
                </button>
              </div>
            </div>
          )}

          {/* Response Display */}
          {apiResponse && (
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <h3 className="font-medium mb-2">Last API Response:</h3>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap bg-white p-3 rounded border">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Progress Status */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Development Progress</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>✅ Project scaffolding complete</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>✅ Backend FastAPI server with modern lifespan</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>✅ Frontend React app with Tailwind CSS</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>✅ Google Gemini AI integration</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>✅ SMTP email service setup</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span>🔄 Current: Full-stack integration testing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
