import React from 'react'
import { marked } from 'marked'
import { colors } from '../../utils/colors'

const EmailPreview = ({ 
  emailRecipients, 
  emailSubject, 
  editableEmailContent, 
  summary, 
  senderDetails, 
  includeSenderDetails, 
  includeTranscript, 
  transcript 
}) => {
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
  )
}

export default EmailPreview
