import React from 'react'
import { colors } from '../../utils/colors'
import { 
  MdPerson, 
  MdEdit, 
  MdCheckCircle, 
  MdAttachment 
} from 'react-icons/md'

const EmailOptions = ({ 
  includeTranscript, 
  setIncludeTranscript, 
  includeSenderDetails, 
  setIncludeSenderDetails, 
  senderDetails, 
  onEditSenderDetails, 
  loading, 
  onSenderDetailsCheckboxChange 
}) => {
  return (
    <div className="space-y-4">
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
          onChange={onSenderDetailsCheckboxChange}
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
            onClick={onEditSenderDetails}
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
    </div>
  )
}

export default EmailOptions
