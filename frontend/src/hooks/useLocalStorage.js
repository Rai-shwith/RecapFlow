// Custom hook for localStorage operations
import { useState, useEffect, useCallback } from 'react'

export const useLocalStorage = () => {
  // Save sender details to localStorage
  const saveSenderDetailsToStorage = useCallback((details) => {
    try {
      localStorage.setItem('recapflow_sender_details', JSON.stringify(details))
    } catch (e) {
      console.error('Error saving sender details to localStorage:', e)
    }
  }, [])

  // Save recipients to localStorage
  const saveRecipientsToStorage = useCallback((recipients) => {
    try {
      const savedRecipients = JSON.parse(localStorage.getItem('recapflow_recipients') || '[]')
      // Add new recipients to the saved list, avoiding duplicates
      const updatedRecipients = [...new Set([...savedRecipients, ...recipients])]
      localStorage.setItem('recapflow_recipients', JSON.stringify(updatedRecipients))
    } catch (e) {
      console.error('Error saving recipients to localStorage:', e)
    }
  }, [])

  // Get saved recipients from localStorage
  const getSavedRecipients = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem('recapflow_recipients') || '[]')
    } catch (e) {
      console.error('Error loading recipients from localStorage:', e)
      return []
    }
  }, [])

  // Load sender details from localStorage
  const loadSenderDetailsFromStorage = useCallback(() => {
    const savedSenderDetails = localStorage.getItem('recapflow_sender_details')
    if (savedSenderDetails) {
      try {
        return JSON.parse(savedSenderDetails)
      } catch (e) {
        console.error('Error loading sender details from localStorage:', e)
        return null
      }
    }
    return null
  }, [])

  return {
    saveSenderDetailsToStorage,
    saveRecipientsToStorage,
    getSavedRecipients,
    loadSenderDetailsFromStorage
  }
}

// Custom hook for sender details management
export const useSenderDetails = (initialDetails = {}) => {
  const { saveSenderDetailsToStorage, loadSenderDetailsFromStorage } = useLocalStorage()
  
  const [senderDetails, setSenderDetails] = useState({
    name: '',
    company: '',
    position: '',
    email: '',
    phone: '',
    ...initialDetails
  })

  // Load saved data on mount
  useEffect(() => {
    const savedDetails = loadSenderDetailsFromStorage()
    if (savedDetails) {
      setSenderDetails(savedDetails)
    }
  }, [loadSenderDetailsFromStorage])

  const handleSenderDetailsChange = useCallback((field, value) => {
    const updatedDetails = {
      ...senderDetails,
      [field]: value
    }
    setSenderDetails(updatedDetails)
    return updatedDetails
  }, [senderDetails])

  const saveSenderDetails = useCallback(() => {
    saveSenderDetailsToStorage(senderDetails)
  }, [senderDetails, saveSenderDetailsToStorage])

  return {
    senderDetails,
    setSenderDetails,
    handleSenderDetailsChange,
    saveSenderDetails
  }
}
