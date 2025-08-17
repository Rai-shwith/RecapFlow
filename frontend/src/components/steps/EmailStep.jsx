import React from 'react'
import { marked } from 'marked'
import { colors } from '../../utils/colors'
import { LoadingButton } from '../LoadingComponents'
import EmailInput from '../EmailInput'
import SummaryViewer from '../SummaryViewer'
import { 
  MdEmail, 
  MdSubject, 
  MdAttachment, 
  MdPerson, 
  MdEdit, 
  MdPreview, 
  MdSave, 
  MdClose,
  MdArrowBack,
  MdSend,
  MdBusiness,
  MdWork,
  MdPhone,
  MdCheckCircle
} from 'react-icons/md'

const EmailStep = ({ 
  emailRecipients, 
  setEmailRecipients, 
  emailSubject, 
  setEmailSubject, 
  includeTranscript, 
  setIncludeTranscript, 
  summary, 
  transcript, 
  onSendEmail, 
  loading,
  onNext,
  onPrevious
}) => {
  const [includeSenderDetails, setIncludeSenderDetails] = React.useState(false)
  const [showSenderPopup, setShowSenderPopup] = React.useState(false)
  const [isEditingEmail, setIsEditingEmail] = React.useState(false)
  const [editableEmailContent, setEditableEmailContent] = React.useState('')
  const [senderDetails, setSenderDetails] = React.useState({
    name: '',
    company: '',
    position: '',
    email: '',
    phone: ''
  })

  // Load saved data from localStorage on component mount
  React.useEffect(() => {
    // Load saved sender details
    const savedSenderDetails = localStorage.getItem('recapflow_sender_details')
    if (savedSenderDetails) {
      try {
        setSenderDetails(JSON.parse(savedSenderDetails))
      } catch (e) {
        console.error('Error loading sender details from localStorage:', e)
      }
    }
  }, [])

  // Initialize editable email content when summary changes
  React.useEffect(() => {
    if (summary) {
      setEditableEmailContent(summary)
    }
  }, [summary])

  const handleSenderDetailsChange = (field, value) => {
    const updatedDetails = {
      ...senderDetails,
      [field]: value
    }
    setSenderDetails(updatedDetails)
    
    // Save to localStorage immediately when editing in the main form
    if (isEditingEmail) {
      saveSenderDetailsToStorage(updatedDetails)
    }
  }

  // Save sender details to localStorage whenever they change
  const saveSenderDetailsToStorage = (details) => {
    try {
      localStorage.setItem('recapflow_sender_details', JSON.stringify(details))
    } catch (e) {
      console.error('Error saving sender details to localStorage:', e)
    }
  }

  // Save recipients to localStorage
  const saveRecipientsToStorage = (recipients) => {
    try {
      const savedRecipients = JSON.parse(localStorage.getItem('recapflow_recipients') || '[]')
      // Add new recipients to the saved list, avoiding duplicates
      const updatedRecipients = [...new Set([...savedRecipients, ...recipients])]
      localStorage.setItem('recapflow_recipients', JSON.stringify(updatedRecipients))
    } catch (e) {
      console.error('Error saving recipients to localStorage:', e)
    }
  }

  // Get saved recipients from localStorage
  const getSavedRecipients = () => {
    try {
      return JSON.parse(localStorage.getItem('recapflow_recipients') || '[]')
    } catch (e) {
      console.error('Error loading recipients from localStorage:', e)
      return []
    }
  }

  const handleSaveSenderDetails = () => {
    setIncludeSenderDetails(true)
    setShowSenderPopup(false)
    // Save to localStorage whenever details are saved
    saveSenderDetailsToStorage(senderDetails)
  }

  const handleSendEmail = () => {
    // Save recipients to localStorage
    if (emailRecipients.length > 0) {
      saveRecipientsToStorage(emailRecipients)
    }
    
    // Save sender details if they are included and modified
    if (includeSenderDetails) {
      saveSenderDetailsToStorage(senderDetails)
    }
    
    // Prepare email content without sender details (backend will handle them separately)
    const emailContent = editableEmailContent || summary
    
    onSendEmail({
      emailContent,
      senderDetails: includeSenderDetails ? senderDetails : null
    })
  }

  const formatSenderSignature = () => {
    if (!includeSenderDetails) return ''
    
    const { name, company, position, email, phone } = senderDetails
    let signature = '\n\n---\n'
    if (name) signature += `${name}\n`
    if (position && company) signature += `${position} at ${company}\n`
    else if (position) signature += `${position}\n`
    else if (company) signature += `${company}\n`
    if (email) signature += `Email: ${email}\n`
    if (phone) signature += `Phone: ${phone}\n`
    
    return signature
  }
  return (
    <div className="space-y-6">
      <h2 
        className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center flex items-center justify-center gap-3"
        style={{ color: colors.darkPurple }}
      >
        <MdEmail className="text-2xl sm:text-3xl" />
        Send Summary via Email
      </h2>

      {/* Email Recipients */}
      <div>
        <label 
          className="flex items-center gap-2 text-sm font-medium mb-2"
          style={{ color: colors.darkBrown }}
        >
          <MdEmail className="text-lg" />
          Recipients:
        </label>
        <EmailInput
          emails={emailRecipients}
          setEmails={setEmailRecipients}
          placeholder="Enter email addresses (separate with comma or space)"
        />
      </div>

      {/* Email Subject */}
      <div>
        <label 
          className="flex items-center gap-2 text-sm font-medium mb-2"
          style={{ color: colors.darkBrown }}
        >
          <MdSubject className="text-lg" />
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
          disabled={loading}
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
          disabled={loading}
        />
        <label 
          htmlFor="includeTranscript"
          className="text-sm font-medium cursor-pointer flex items-center gap-2"
          style={{ color: colors.darkBrown }}
        >
          <MdAttachment className="text-lg" />
          Include original transcript in email
        </label>
      </div>

      {/* Include Sender Details Option */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="includeSenderDetails"
          checked={includeSenderDetails}
          onChange={(e) => {
            if (e.target.checked) {
              // Auto-populate from localStorage if available
              const savedSenderDetails = localStorage.getItem('recapflow_sender_details')
              if (savedSenderDetails) {
                try {
                  const parsedDetails = JSON.parse(savedSenderDetails)
                  setSenderDetails(parsedDetails)
                  setIncludeSenderDetails(true)
                  // If details exist, don't show popup
                  if (parsedDetails.name || parsedDetails.email) {
                    return
                  }
                } catch (e) {
                  console.error('Error loading sender details:', e)
                }
              }
              setShowSenderPopup(true)
            } else {
              setIncludeSenderDetails(false)
              // Don't clear the details, just uncheck - keep them for next time
            }
          }}
          className="w-4 h-4 rounded focus:ring-2"
          style={{ 
            accentColor: colors.gold
          }}
          disabled={loading}
        />
        <label 
          htmlFor="includeSenderDetails"
          className="text-sm font-medium cursor-pointer flex items-center gap-2"
          style={{ color: colors.darkBrown }}
        >
          <MdPerson className="text-lg" />
          Include sender details in email
        </label>
        {includeSenderDetails && (
          <button
            onClick={() => setShowSenderPopup(true)}
            className="text-xs px-2 py-1 rounded transition-all duration-200 hover:shadow-sm flex items-center gap-1"
            style={{ 
              backgroundColor: colors.beige,
              color: colors.darkPurple
            }}
          >
            <MdEdit className="text-sm" />
            Edit Details
          </button>
        )}
        {includeSenderDetails && senderDetails.name && (
          <span 
            className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 flex items-center gap-1"
            title="Sender details saved to localStorage"
          >
            <MdCheckCircle className="text-sm" />
            Saved
          </span>
        )}
      </div>

      {/* Email Preview */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <label 
            className="text-sm font-medium"
            style={{ color: colors.darkBrown }}
          >
            Email Preview:
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditingEmail(!isEditingEmail)}
              className="text-xs px-3 py-1 rounded transition-all duration-200 hover:shadow-sm flex items-center gap-1"
              style={{ 
                backgroundColor: isEditingEmail ? colors.gold : colors.beige,
                color: colors.darkPurple
              }}
            >
              {isEditingEmail ? (
                <>
                  <MdPreview className="text-sm" />
                  Preview Mode
                </>
              ) : (
                <>
                  <MdEdit className="text-sm" />
                  Edit Email
                </>
              )}
            </button>
            {isEditingEmail && (
              <button
                onClick={() => {
                  setIsEditingEmail(false)
                  // Save sender details when exiting edit mode
                  if (includeSenderDetails) {
                    saveSenderDetailsToStorage(senderDetails)
                  }
                }}
                className="text-xs px-3 py-1 rounded transition-all duration-200 hover:shadow-sm flex items-center gap-1"
                style={{ 
                  backgroundColor: colors.darkBrown,
                  color: 'white'
                }}
              >
                <MdSave className="text-sm" />
                Save Changes
              </button>
            )}
          </div>
        </div>
        {isEditingEmail ? (
          <div className="space-y-4">
            {/* Editable Subject */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.darkBrown }}>
                Subject:
              </label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2"
                style={{ 
                  borderColor: colors.beige,
                  '--tw-ring-color': `${colors.gold}40`
                }}
              />
            </div>

            {/* Editable Email Content */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.darkBrown }}>
                Email Content:
              </label>
              <textarea
                value={editableEmailContent}
                onChange={(e) => setEditableEmailContent(e.target.value)}
                className="w-full h-48 p-3 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2"
                style={{ 
                  borderColor: colors.beige,
                  '--tw-ring-color': `${colors.gold}40`
                }}
                placeholder="Edit your email content here..."
              />
            </div>

            {/* Editable Sender Details */}
            {includeSenderDetails && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.darkBrown }}>
                  Sender Signature:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={senderDetails.name}
                    onChange={(e) => handleSenderDetailsChange('name', e.target.value)}
                    className="p-2 border rounded text-sm focus:outline-none focus:ring-2"
                    style={{ 
                      borderColor: colors.beige,
                      '--tw-ring-color': `${colors.gold}40`
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={senderDetails.company}
                    onChange={(e) => handleSenderDetailsChange('company', e.target.value)}
                    className="p-2 border rounded text-sm focus:outline-none focus:ring-2"
                    style={{ 
                      borderColor: colors.beige,
                      '--tw-ring-color': `${colors.gold}40`
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Position"
                    value={senderDetails.position}
                    onChange={(e) => handleSenderDetailsChange('position', e.target.value)}
                    className="p-2 border rounded text-sm focus:outline-none focus:ring-2"
                    style={{ 
                      borderColor: colors.beige,
                      '--tw-ring-color': `${colors.gold}40`
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={senderDetails.email}
                    onChange={(e) => handleSenderDetailsChange('email', e.target.value)}
                    className="p-2 border rounded text-sm focus:outline-none focus:ring-2"
                    style={{ 
                      borderColor: colors.beige,
                      '--tw-ring-color': `${colors.gold}40`
                    }}
                  />
                  <input
                    type="tel"
                    placeholder="Phone (Optional)"
                    value={senderDetails.phone}
                    onChange={(e) => handleSenderDetailsChange('phone', e.target.value)}
                    className="p-2 border rounded text-sm focus:outline-none focus:ring-2"
                    style={{ 
                      borderColor: colors.beige,
                      '--tw-ring-color': `${colors.gold}40`
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div 
            className="p-4 sm:p-6 rounded-lg border max-h-80 overflow-y-auto"
            style={{ 
              backgroundColor: `${colors.beige}10`,
              borderColor: colors.beige
            }}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <span className="font-semibold text-sm" style={{ color: colors.darkBrown }}>To:</span>
                  <span className="ml-2 text-sm">{emailRecipients.join(', ') || 'No recipients'}</span>
                </div>
                <div>
                  <span className="font-semibold text-sm" style={{ color: colors.darkBrown }}>Subject:</span>
                  <span className="ml-2 text-sm">{emailSubject}</span>
                </div>
              </div>
              
              <hr style={{ borderColor: colors.beige }} />
              
              <div>
                <h4 className="font-semibold text-sm mb-2" style={{ color: colors.darkBrown }}>
                  Summary Content:
                </h4>
                <div 
                  className="text-sm prose prose-sm max-w-none text-left p-3 rounded"
                  style={{ 
                    backgroundColor: `${colors.gold}10`,
                    color: colors.darkPurple
                  }}
                  dangerouslySetInnerHTML={{ __html: marked(editableEmailContent || summary || 'No summary available') }}
                />
                {formatSenderSignature() && (
                  <div 
                    className="text-sm mt-3 p-3 rounded border-t"
                    style={{ 
                      backgroundColor: `${colors.beige}20`,
                      borderColor: colors.beige,
                      color: colors.darkPurple
                    }}
                  >
                    <div 
                      className="whitespace-pre-wrap font-sans"
                      dangerouslySetInnerHTML={{ 
                        __html: formatSenderSignature().replace(/---/g, '<hr style="margin: 8px 0; border: none; border-top: 1px solid #ccc;">') 
                      }}
                    />
                  </div>
                )}
                {includeTranscript && transcript && (
                  <div 
                    className="text-sm mt-3 p-3 rounded"
                    style={{ 
                      backgroundColor: `${colors.beige}20`,
                      color: colors.darkPurple
                    }}
                  >
                    <h5 className="font-semibold mb-2">Original Transcript:</h5>
                    <pre className="whitespace-pre-wrap text-xs">{transcript}</pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between pt-4 sm:pt-6 gap-4">
        <button
          onClick={onPrevious}
          disabled={loading}
          className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50 text-sm sm:text-base order-2 sm:order-1 flex items-center justify-center gap-2"
          style={{ 
            backgroundColor: colors.beige,
            color: colors.darkPurple
          }}
        >
          <MdArrowBack className="text-lg" />
          Back
        </button>
        <LoadingButton
          onClick={handleSendEmail}
          loading={loading}
          disabled={emailRecipients.length === 0}
          className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base order-1 sm:order-2 flex items-center justify-center gap-2"
          style={{ 
            backgroundColor: emailRecipients.length > 0 ? colors.darkBrown : colors.beige,
            color: 'white'
          }}
        >
          <MdSend className="text-lg" />
          <span className="hidden sm:inline">{`Send Email${emailRecipients.length > 1 ? `s (${emailRecipients.length})` : ''}`}</span>
          <span className="sm:hidden">Send</span>
        </LoadingButton>
      </div>

      {/* Sender Details Popup */}
      {showSenderPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            style={{ borderColor: colors.beige }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 
                  className="text-lg font-semibold flex items-center gap-2"
                  style={{ color: colors.darkPurple }}
                >
                  <MdPerson className="text-xl" />
                  Add Sender Details
                </h3>
                <button
                  onClick={() => setShowSenderPopup(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold transition-colors"
                >
                  <MdClose />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: colors.darkBrown }}>
                    <MdPerson className="text-lg" />
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={senderDetails.name}
                    onChange={(e) => handleSenderDetailsChange('name', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      borderColor: colors.beige,
                      '--tw-ring-color': `${colors.gold}40`
                    }}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: colors.darkBrown }}>
                    <MdBusiness className="text-lg" />
                    Company
                  </label>
                  <input
                    type="text"
                    value={senderDetails.company}
                    onChange={(e) => handleSenderDetailsChange('company', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      borderColor: colors.beige,
                      '--tw-ring-color': `${colors.gold}40`
                    }}
                    placeholder="Your company name"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: colors.darkBrown }}>
                    <MdWork className="text-lg" />
                    Position
                  </label>
                  <input
                    type="text"
                    value={senderDetails.position}
                    onChange={(e) => handleSenderDetailsChange('position', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      borderColor: colors.beige,
                      '--tw-ring-color': `${colors.gold}40`
                    }}
                    placeholder="Your job title"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: colors.darkBrown }}>
                    <MdEmail className="text-lg" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={senderDetails.email}
                    onChange={(e) => handleSenderDetailsChange('email', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      borderColor: colors.beige,
                      '--tw-ring-color': `${colors.gold}40`
                    }}
                    placeholder="your.email@company.com"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: colors.darkBrown }}>
                    <MdPhone className="text-lg" />
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={senderDetails.phone}
                    onChange={(e) => handleSenderDetailsChange('phone', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      borderColor: colors.beige,
                      '--tw-ring-color': `${colors.gold}40`
                    }}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={() => setShowSenderPopup(false)}
                  className="flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
                  style={{ 
                    backgroundColor: colors.beige,
                    color: colors.darkPurple
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSenderDetails}
                  className="flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
                  style={{ 
                    backgroundColor: colors.darkBrown,
                    color: 'white'
                  }}
                >
                  Save Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmailStep
