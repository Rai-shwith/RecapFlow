import React from 'react'
import { colors } from '../../utils/colors'
import { LoadingButton } from '../LoadingComponents'
import { MdArrowBack, MdSend } from 'react-icons/md'

const EmailNavigation = ({ 
  onPrevious, 
  onSendEmail, 
  loading, 
  emailRecipients 
}) => {
  return (
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
        onClick={onSendEmail}
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
  )
}

export default EmailNavigation
