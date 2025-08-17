import React from 'react'
import { colors } from '../utils/colors'

const AlertMessage = ({ type = 'info', message, onClose }) => {
  if (!message) return null

  const getAlertStyles = () => {
    switch (type) {
      case 'error':
        return {
          backgroundColor: '#fef2f2',
          borderColor: '#fecaca',
          textColor: '#dc2626',
          icon: '❌'
        }
      case 'success':
        return {
          backgroundColor: `${colors.gold}10`,
          borderColor: `${colors.gold}50`,
          textColor: colors.darkBrown,
          icon: '✅'
        }
      case 'warning':
        return {
          backgroundColor: '#fffbeb',
          borderColor: '#fed7aa',
          textColor: '#d97706',
          icon: '⚠️'
        }
      default:
        return {
          backgroundColor: '#f0f9ff',
          borderColor: '#bae6fd',
          textColor: '#0369a1',
          icon: 'ℹ️'
        }
    }
  }

  const styles = getAlertStyles()

  return (
    <div 
      className="border rounded-lg p-4 mb-6 flex items-start gap-3"
      style={{ 
        backgroundColor: styles.backgroundColor,
        borderColor: styles.borderColor
      }}
    >
      <span className="text-lg">{styles.icon}</span>
      <div className="flex-1">
        <p style={{ color: styles.textColor }}>{message}</p>
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className="text-lg hover:opacity-70 transition-opacity"
          style={{ color: styles.textColor }}
        >
          ×
        </button>
      )}
    </div>
  )
}

export default AlertMessage
