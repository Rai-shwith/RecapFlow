import React from 'react'
import { colors } from '../../utils/colors'
import EmailPreview from './EmailPreview'
import EmailEditor from './EmailEditor'
import { MdEdit, MdPreview, MdSave } from 'react-icons/md'

const EmailContentSection = ({ 
  isEditingEmail, 
  setIsEditingEmail, 
  emailRecipients, 
  emailSubject, 
  setEmailSubject, 
  editableEmailContent, 
  setEditableEmailContent, 
  summary, 
  senderDetails, 
  onSenderDetailsChange, 
  includeSenderDetails, 
  includeTranscript, 
  transcript, 
  onSaveChanges 
}) => {
  return (
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
              onClick={onSaveChanges}
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
        <EmailEditor
          emailSubject={emailSubject}
          setEmailSubject={setEmailSubject}
          editableEmailContent={editableEmailContent}
          setEditableEmailContent={setEditableEmailContent}
          senderDetails={senderDetails}
          onSenderDetailsChange={onSenderDetailsChange}
          includeSenderDetails={includeSenderDetails}
          onSaveChanges={onSaveChanges}
        />
      ) : (
        <EmailPreview
          emailRecipients={emailRecipients}
          emailSubject={emailSubject}
          editableEmailContent={editableEmailContent}
          summary={summary}
          senderDetails={senderDetails}
          includeSenderDetails={includeSenderDetails}
          includeTranscript={includeTranscript}
          transcript={transcript}
        />
      )}
    </div>
  )
}

export default EmailContentSection
