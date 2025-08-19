import React, { useState } from 'react';
import { MdAdd, MdDelete, MdEmail, MdPreview, MdAttachment, MdSend } from 'react-icons/md';
import { marked } from 'marked';
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
  const [newRecipient, setNewRecipient] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderTitle, setSenderTitle] = useState('');

  const addRecipient = () => {
    if (newRecipient.trim() && !emailRecipients.includes(newRecipient.trim())) {
      setEmailRecipients([...emailRecipients, newRecipient.trim()]);
      setNewRecipient('');
    }
  };

  const removeRecipient = (index: number) => {
    setEmailRecipients(emailRecipients.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addRecipient();
    }
  };

  const generateEmailBody = () => {
    const signature = senderName ? `\n\nBest regards,\n${senderName}${senderTitle ? `\n${senderTitle}` : ''}` : '';
    return `${summary}${signature}`;
  };

  const renderEmailPreview = () => {
    try {
      return marked(generateEmailBody());
    } catch (error) {
      console.error('Error rendering email preview:', error);
      return generateEmailBody();
    }
  };

  const handleSendEmail = () => {
    const emailData = {
      recipients: emailRecipients,
      subject: emailSubject,
      body: generateEmailBody(),
      includeTranscript,
      senderName,
      senderTitle
    };
    onSendEmail(emailData);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-gray-800">
          Send Summary via Email
        </h2>
        <p className="text-gray-600 text-sm">
          Share your summary with colleagues and stakeholders
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Email Configuration */}
        <div className="space-y-6">
          {/* Recipients */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <MdEmail className="inline mr-2" />
              Recipients
            </label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter email address"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
                <button
                  onClick={addRecipient}
                  disabled={!newRecipient.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <MdAdd />
                </button>
              </div>
              {emailRecipients.length > 0 && (
                <div className="space-y-2">
                  {emailRecipients.map((recipient, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                      <span className="text-sm text-gray-700">{recipient}</span>
                      <button
                        onClick={() => removeRecipient(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Subject */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Subject Line
            </label>
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="Meeting Summary - [Date]"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>

          {/* Sender Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Signature (Optional)
            </label>
            <div className="space-y-3">
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Your name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
              <input
                type="text"
                value={senderTitle}
                onChange={(e) => setSenderTitle(e.target.value)}
                placeholder="Your title/position"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>

          {/* Options */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <MdAttachment className="inline mr-2" />
              Options
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={includeTranscript}
                onChange={(e) => setIncludeTranscript(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Include full transcript as attachment</span>
            </label>
          </div>
        </div>

        {/* Email Preview */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Email Preview</h3>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                <MdPreview />
                {showPreview ? 'Hide' : 'Show'} Preview
              </button>
            </div>
          </div>
          {showPreview && (
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>To:</strong> {emailRecipients.join(', ') || 'No recipients'}</div>
                <div><strong>Subject:</strong> {emailSubject || 'No subject'}</div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div 
                  className="prose prose-blue max-w-none text-sm markdown-content"
                  dangerouslySetInnerHTML={{ __html: renderEmailPreview() }}
                />
                {includeTranscript && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-600 font-medium">📎 Attachment:</div>
                    <div className="text-xs text-gray-500">transcript.txt ({transcript.length} characters)</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between pt-4 sm:pt-6 gap-4">
        <button
          onClick={onPrevious}
          disabled={loading}
          className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50 text-sm sm:text-base order-2 sm:order-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Back to Edit
        </button>
        <button
          onClick={handleSendEmail}
          disabled={emailRecipients.length === 0 || !emailSubject.trim() || loading}
          className={`px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base order-1 sm:order-2 flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md ${
            emailRecipients.length > 0 && emailSubject.trim() && !loading
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Sending...
            </>
          ) : (
            <>
              <MdSend />
              Send Email
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default EmailStep;
