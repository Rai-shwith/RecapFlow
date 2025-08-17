import React from 'react'
import { colors } from '../../utils/colors'
import SenderDetailsForm from './SenderDetailsForm'
import { MdPerson, MdClose } from 'react-icons/md'

const SenderDetailsPopup = ({ 
  isOpen, 
  onClose, 
  senderDetails, 
  onSenderDetailsChange, 
  onSave 
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        style={{ borderColor: colors.beige }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 
              className="text-lg font-semibold flex items-center gap-2"
              style={{ color: colors.darkPurple }}
            >
              <MdPerson className="text-xl" />
              Add Sender Details
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold transition-colors"
            >
              <MdClose />
            </button>
          </div>

          <SenderDetailsForm
            senderDetails={senderDetails}
            onSenderDetailsChange={onSenderDetailsChange}
            isInline={false}
          />

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
              style={{ 
                backgroundColor: colors.beige,
                color: colors.darkPurple
              }}
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
              style={{ 
                backgroundColor: colors.darkBrown,
                color: 'white'
              }}
            >
              Save Details
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SenderDetailsPopup
