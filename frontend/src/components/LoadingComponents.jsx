import React from 'react'
import { ClipLoader, BarLoader } from 'react-spinners'
import { colors } from '../utils/colors'

export const LoadingSpinner = ({ size = 35, color = colors.gold }) => (
  <ClipLoader color={color} size={size} />
)

export const LoadingBar = ({ width = '100%', height = 4, color = colors.gold }) => (
  <BarLoader color={color} width={width} height={height} />
)

export const LoadingButton = ({ loading, children, disabled, onClick, ...props }) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
    {...props}
  >
    {loading && <LoadingSpinner size={20} color="currentColor" />}
    {children}
  </button>
)
