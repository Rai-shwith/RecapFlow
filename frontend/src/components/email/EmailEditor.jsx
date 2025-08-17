import React from 'react'
import { colors } from '../../utils/colors'
import SenderDetailsForm from './SenderDetailsForm'
import { MdEdit, MdPreview, MdSave } from 'react-icons/md'

const EmailEditor = ({ 
  emailSubject, 
  setEmailSubject, 
  editableEmailContent, 
  setEditableEmailContent, 
  senderDetails, 
  onSenderDetailsChange, 
  includeSenderDetails, 
  onSaveChanges 
}) => {
  return (
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
          <SenderDetailsForm
            senderDetails={senderDetails}
            onSenderDetailsChange={onSenderDetailsChange}
            isInline={true}
          />
        </div>
      )}
    </div>
  )
}

export default EmailEditor
