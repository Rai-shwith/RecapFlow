import React from 'react'
import { colors } from '../../utils/colors'
import EmailInput from '../EmailInput'
import SenderDetailsPopup from '../email/SenderDetailsPopup'
import EmailOptions from '../email/EmailOptions'
import EmailContentSection from '../email/EmailContentSection'
import EmailNavigation from '../email/EmailNavigation'
import { useSenderDetails, useLocalStorage } from '../../hooks/useLocalStorage'
import { MdEmail, MdSubject } from 'react-icons/md'

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

  // Use custom hooks for sender details and localStorage
  const { senderDetails, handleSenderDetailsChange, saveSenderDetails } = useSenderDetails()
  const { saveRecipientsToStorage, loadSenderDetailsFromStorage } = useLocalStorage()

  // Initialize editable email content when summary changes
  React.useEffect(() => {
    if (summary) {
      setEditableEmailContent(summary)
    }
  }, [summary])

  const handleSaveSenderDetails = () => {
    setIncludeSenderDetails(true)
    setShowSenderPopup(false)
    // Save to localStorage whenever details are saved
    saveSenderDetails()
  }

  const handleSenderDetailsCheckboxChange = (e) => {
    if (e.target.checked) {
      // Auto-populate from localStorage if available
      const savedSenderDetails = loadSenderDetailsFromStorage()
      if (savedSenderDetails && (savedSenderDetails.name || savedSenderDetails.email)) {
        setIncludeSenderDetails(true)
        // If details exist, don't show popup
        return
      }
      setShowSenderPopup(true)
    } else {
      setIncludeSenderDetails(false)
      // Don't clear the details, just uncheck - keep them for next time
    }
  }

  const handleSaveChanges = () => {
    setIsEditingEmail(false)
    // Save sender details when exiting edit mode
    if (includeSenderDetails) {
      saveSenderDetails()
    }
  }

  const handleSendEmail = () => {
    // Save recipients to localStorage
    if (emailRecipients.length > 0) {
      saveRecipientsToStorage(emailRecipients)
    }
    
    // Save sender details if they are included and modified
    if (includeSenderDetails) {
      saveSenderDetails()
    }
    
    // Prepare email content without sender details (backend will handle them separately)
    const emailContent = editableEmailContent || summary
    
    onSendEmail({
      emailContent,
      senderDetails: includeSenderDetails ? senderDetails : null
    })
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

      {/* Email Options */}
      <EmailOptions
        includeTranscript={includeTranscript}
        setIncludeTranscript={setIncludeTranscript}
        includeSenderDetails={includeSenderDetails}
        setIncludeSenderDetails={setIncludeSenderDetails}
        senderDetails={senderDetails}
        onEditSenderDetails={() => setShowSenderPopup(true)}
        loading={loading}
        onSenderDetailsCheckboxChange={handleSenderDetailsCheckboxChange}
      />

      {/* Email Content Section */}
      <EmailContentSection
        isEditingEmail={isEditingEmail}
        setIsEditingEmail={setIsEditingEmail}
        emailRecipients={emailRecipients}
        emailSubject={emailSubject}
        setEmailSubject={setEmailSubject}
        editableEmailContent={editableEmailContent}
        setEditableEmailContent={setEditableEmailContent}
        summary={summary}
        senderDetails={senderDetails}
        onSenderDetailsChange={handleSenderDetailsChange}
        includeSenderDetails={includeSenderDetails}
        includeTranscript={includeTranscript}
        transcript={transcript}
        onSaveChanges={handleSaveChanges}
      />

      {/* Navigation */}
      <EmailNavigation
        onPrevious={onPrevious}
        onSendEmail={handleSendEmail}
        loading={loading}
        emailRecipients={emailRecipients}
      />

      {/* Sender Details Popup */}
      <SenderDetailsPopup
        isOpen={showSenderPopup}
        onClose={() => setShowSenderPopup(false)}
        senderDetails={senderDetails}
        onSenderDetailsChange={handleSenderDetailsChange}
        onSave={handleSaveSenderDetails}
      />
    </div>
  )
}

export default EmailStep
