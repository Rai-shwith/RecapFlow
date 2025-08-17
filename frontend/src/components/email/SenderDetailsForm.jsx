import React from 'react'
import { colors } from '../../utils/colors'
import { 
  MdPerson, 
  MdBusiness, 
  MdWork, 
  MdEmail, 
  MdPhone 
} from 'react-icons/md'

const SenderDetailsForm = ({ 
  senderDetails, 
  onSenderDetailsChange, 
  isInline = false 
}) => {
  const inputClass = `p-3 border rounded-lg focus:outline-none focus:ring-2 ${
    isInline ? 'p-2 text-sm' : ''
  }`
  
  const inputStyle = { 
    borderColor: colors.beige,
    '--tw-ring-color': `${colors.gold}40`
  }

  return (
    <div className={`space-y-4 ${isInline ? 'grid grid-cols-1 sm:grid-cols-2 gap-3 space-y-0' : ''}`}>
      <div>
        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isInline ? 'sr-only' : ''}`} style={{ color: colors.darkBrown }}>
          <MdPerson className="text-lg" />
          Your Name
        </label>
        <input
          type="text"
          value={senderDetails.name}
          onChange={(e) => onSenderDetailsChange('name', e.target.value)}
          className={`w-full ${inputClass}`}
          style={inputStyle}
          placeholder={isInline ? "Your Name" : "Enter your full name"}
        />
      </div>

      <div>
        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isInline ? 'sr-only' : ''}`} style={{ color: colors.darkBrown }}>
          <MdBusiness className="text-lg" />
          Company
        </label>
        <input
          type="text"
          value={senderDetails.company}
          onChange={(e) => onSenderDetailsChange('company', e.target.value)}
          className={`w-full ${inputClass}`}
          style={inputStyle}
          placeholder={isInline ? "Company" : "Your company name"}
        />
      </div>

      <div>
        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isInline ? 'sr-only' : ''}`} style={{ color: colors.darkBrown }}>
          <MdWork className="text-lg" />
          Position
        </label>
        <input
          type="text"
          value={senderDetails.position}
          onChange={(e) => onSenderDetailsChange('position', e.target.value)}
          className={`w-full ${inputClass}`}
          style={inputStyle}
          placeholder={isInline ? "Position" : "Your job title"}
        />
      </div>

      <div>
        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isInline ? 'sr-only' : ''}`} style={{ color: colors.darkBrown }}>
          <MdEmail className="text-lg" />
          Email
        </label>
        <input
          type="email"
          value={senderDetails.email}
          onChange={(e) => onSenderDetailsChange('email', e.target.value)}
          className={`w-full ${inputClass}`}
          style={inputStyle}
          placeholder={isInline ? "Email" : "your.email@company.com"}
        />
      </div>

      <div className={isInline ? 'sm:col-span-1' : ''}>
        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isInline ? 'sr-only' : ''}`} style={{ color: colors.darkBrown }}>
          <MdPhone className="text-lg" />
          Phone (Optional)
        </label>
        <input
          type="tel"
          value={senderDetails.phone}
          onChange={(e) => onSenderDetailsChange('phone', e.target.value)}
          className={`w-full ${inputClass}`}
          style={inputStyle}
          placeholder={isInline ? "Phone (Optional)" : "+1 (555) 123-4567"}
        />
      </div>
    </div>
  )
}

export default SenderDetailsForm
