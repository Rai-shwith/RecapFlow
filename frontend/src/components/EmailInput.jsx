import React, { useState, useRef } from 'react'
import { colors } from '../utils/colors'

// Email chip component for Gmail-style email input
const EmailChip = ({ email, onRemove, onEdit, isValid = true }) => (
  <span 
    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2 transition-all duration-200 hover:shadow-md ${
      isValid ? 'border' : 'border-2 border-red-300'
    }`}
    style={{ 
      backgroundColor: isValid ? `${colors.gold}20` : '#fef2f2', 
      color: isValid ? colors.darkBrown : '#dc2626',
      border: isValid ? `1px solid ${colors.gold}50` : '1px solid #fca5a5'
    }}
  >
    <span onClick={onEdit} className="cursor-pointer hover:underline">{email}</span>
    <button
      onClick={onRemove}
      className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-red-200 transition-colors"
      style={{ color: isValid ? colors.darkPurple : '#dc2626' }}
    >
      ×
    </button>
  </span>
)

// Email validation function
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Gmail-style email input component with validation
const EmailInput = ({ emails, setEmails, placeholder }) => {
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  const addEmail = (email) => {
    const trimmedEmail = email.trim()
    if (!trimmedEmail) return

    if (!validateEmail(trimmedEmail)) {
      setError(`"${trimmedEmail}" is not a valid email address`)
      return
    }

    if (emails.includes(trimmedEmail)) {
      setError(`"${trimmedEmail}" is already added`)
      return
    }

    setEmails([...emails, trimmedEmail])
    setError('')
  }

  const removeEmail = (index) => {
    setEmails(emails.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e) => {
    if (e.key === ',' || e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      if (inputValue.trim()) {
        addEmail(inputValue)
        setInputValue('')
      }
    } else if (e.key === 'Backspace' && !inputValue && emails.length > 0) {
      const lastEmail = emails[emails.length - 1]
      setInputValue(lastEmail)
      removeEmail(emails.length - 1)
      setTimeout(() => inputRef.current?.focus(), 0)
    } else {
      setError('') // Clear error when user starts typing
    }
  }

  const handleBlur = () => {
    if (inputValue.trim()) {
      addEmail(inputValue)
      setInputValue('')
    }
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
    if (error) setError('') // Clear error when user types
  }

  return (
    <div className="space-y-2">
      <div 
        className={`border-2 rounded-lg p-3 min-h-[48px] flex flex-wrap items-center focus-within:ring-2 transition-all duration-200 ${
          error ? 'border-red-300' : ''
        }`}
        style={{ 
          borderColor: error ? '#fca5a5' : colors.beige,
          '--tw-ring-color': error ? '#fca5a5' : `${colors.gold}40`
        }}
      >
        {emails.map((email, index) => (
          <EmailChip
            key={index}
            email={email}
            isValid={validateEmail(email)}
            onRemove={() => removeEmail(index)}
            onEdit={() => {
              setInputValue(email)
              removeEmail(index)
              setTimeout(() => inputRef.current?.focus(), 0)
            }}
          />
        ))}
        <input
          ref={inputRef}
          type="email"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={emails.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] outline-none bg-transparent"
          style={{ color: colors.darkPurple }}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <span className="text-red-500">⚠️</span>
          {error}
        </p>
      )}
      <p 
        className="text-xs"
        style={{ color: colors.brown }}
      >
        Tip: Type email and press comma, space, or enter to add. Click emails to edit them.
      </p>
    </div>
  )
}

export default EmailInput
