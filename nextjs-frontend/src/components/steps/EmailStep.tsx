import React from 'react';
import { colors } from '@/utils/colors';

interface EmailStepProps {
  emailRecipients: string[];
  setEmailRecipients: (recipients: string[]) => void;
  emailSubject: string;
  setEmailSubject: (subject: string) => void;
  includeTranscript: boolean;
  setIncludeTranscript: (include: boolean) => void;
  summary: string;
  transcript: string;
  onSendEmail: (emailData?: any) => void;
  loading: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

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
}: EmailStepProps) => {
  return (
    <div className="space-y-6">
      <h2 
        className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center text-gray-800"
      >
        Send Summary via Email
      </h2>

      <div className="bg-blue-50 rounded-lg p-6 text-center">
        <div className="text-4xl mb-4">🚧</div>
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Email Step Coming Soon
        </h3>
        <p className="text-blue-800 text-sm">
          Professional email sharing with custom signatures will be available here.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between pt-4 sm:pt-6 gap-4">
        <button
          onClick={onPrevious}
          disabled={loading}
          className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50 text-sm sm:text-base order-2 sm:order-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-700"
        >
          Back
        </button>
        <button
          onClick={() => onSendEmail()}
          disabled={emailRecipients.length === 0 || loading}
          className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base order-1 sm:order-2 flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
          style={{ 
            backgroundColor: emailRecipients.length > 0 ? colors.primary : colors.gray[300],
            color: 'white'
          }}
        >
          Send Email
        </button>
      </div>
    </div>
  );
};

export default EmailStep;
