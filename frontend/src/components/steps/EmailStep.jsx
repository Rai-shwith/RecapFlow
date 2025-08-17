import React from 'react'
import { marked } from 'marked'
import { colors } from '../../utils/colors'
import { LoadingButton } from '../LoadingComponents'
import EmailInput from '../EmailInput'
import SummaryViewer from '../SummaryViewer'

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
  return (
    <div className="space-y-6">
      <h2 
        className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center"
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
          className="p-6 rounded-lg border max-h-80 overflow-y-auto"
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
                dangerouslySetInnerHTML={{ __html: marked(summary || 'No summary available') }}
              />
            </div>
            
            {includeTranscript && (
              <div>
                <h4 className="font-semibold text-sm mb-2" style={{ color: colors.darkBrown }}>
                  Original Transcript:
                </h4>
                <div 
                  className="text-sm italic p-3 rounded max-h-32 overflow-y-auto"
                  style={{ backgroundColor: `${colors.beige}20` }}
                >
                  {transcript ? transcript.substring(0, 300) + (transcript.length > 300 ? '...' : '') : 'No transcript'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between pt-4 sm:pt-6 gap-4">
        <button
          onClick={onPrevious}
          disabled={loading}
          className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50 text-sm sm:text-base order-2 sm:order-1"
          style={{ 
            backgroundColor: colors.beige,
            color: colors.darkPurple
          }}
        >
          Back
        </button>
        <LoadingButton
          onClick={onSendEmail}
          loading={loading}
          disabled={emailRecipients.length === 0}
          className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base order-1 sm:order-2"
          style={{ 
            backgroundColor: emailRecipients.length > 0 ? colors.darkBrown : colors.beige,
            color: 'white'
          }}
        >
          <span className="hidden sm:inline">{`Send Email${emailRecipients.length > 1 ? `s (${emailRecipients.length})` : ''}`}</span>
          <span className="sm:hidden">Send</span>
        </LoadingButton>
      </div>
    </div>
  )
}

export default EmailStep
