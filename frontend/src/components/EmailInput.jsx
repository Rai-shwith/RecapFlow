import React, { useState, useRef } from 'react'
import { colors } from '../utils/colors'
import { MdEmail, MdClose } from 'react-icons/md'

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
      <MdClose className="text-xs" />
    </button>
  </span>
)

// Email validation function
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Gmail-style email input component with validation and autocomplete
const EmailInput = ({ emails, setEmails, placeholder }) => {
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef(null)

  // Get saved recipients for autocomplete
  const getSavedRecipients = () => {
    try {
      return JSON.parse(localStorage.getItem('recapflow_recipients') || '[]')
    } catch (e) {
      return []
    }
  }

  // Filter suggestions based on input
  const updateSuggestions = (value) => {
    if (!value.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const savedRecipients = getSavedRecipients()
    const filtered = savedRecipients
      .filter(email => 
        email.toLowerCase().includes(value.toLowerCase()) &&
        !emails.includes(email) // Don't suggest already added emails
      )
      .slice(0, 5) // Limit to 5 suggestions

    setSuggestions(filtered)
    setShowSuggestions(filtered.length > 0)
  }

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
        setShowSuggestions(false)
      }
    } else if (e.key === 'Backspace' && !inputValue && emails.length > 0) {
      const lastEmail = emails[emails.length - 1]
      setInputValue(lastEmail)
      removeEmail(emails.length - 1)
      setTimeout(() => inputRef.current?.focus(), 0)
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    } else {
      setError('') // Clear error when user starts typing
    }
  }

  const handleBlur = (e) => {
    // Don't add email if user clicked on a suggestion
    setTimeout(() => {
      if (inputValue.trim() && !e.relatedTarget?.closest('.suggestions-dropdown')) {
        addEmail(inputValue)
        setInputValue('')
      }
      setShowSuggestions(false)
    }, 150)
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setInputValue(value)
    if (error) setError('') // Clear error when user types
    updateSuggestions(value)
  }

  const selectSuggestion = (suggestion) => {
    addEmail(suggestion)
    setInputValue('')
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  return (
    <div className="space-y-2 relative">
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
          onFocus={() => updateSuggestions(inputValue)}
          placeholder={emails.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] outline-none bg-transparent"
          style={{ color: colors.darkPurple }}
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          className="suggestions-dropdown absolute top-full left-0 right-0 z-10 bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto"
          style={{ borderColor: colors.beige }}
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => selectSuggestion(suggestion)}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors border-b last:border-b-0"
              style={{ 
                borderColor: `${colors.beige}50`,
                color: colors.darkPurple
              }}
            >
              <div className="flex items-center gap-2">
                <MdEmail className="text-sm text-gray-400" />
                <span>{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}

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
        {getSavedRecipients().length > 0 && (
          <span className="ml-2 text-green-600 flex items-center gap-1">
            <MdEmail className="text-sm" />
            {getSavedRecipients().length} saved recipients available
          </span>
        )}
      </p>
    </div>
  )
}

export default EmailInput
