'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MdArrowBack,
  MdAutoGraph,
  MdError, 
  MdCheckCircle, 
  MdClose
} from 'react-icons/md';
import { Toaster, toast } from 'react-hot-toast';

// Import steps components (we'll create these)
import UploadStep from '@/components/steps/UploadStep';
import SummarizeStep from '@/components/steps/SummarizeStep';
import EditStep from '@/components/steps/EditStep';
import EmailStep from '@/components/steps/EmailStep';
import StepIndicator from '@/components/StepIndicator';
import QuickNavigation from '@/components/QuickNavigation';

// Utility imports
import { colors } from '@/utils/colors';
import { markdownToPlainText, plainTextToMarkdown } from '@/utils/markdown';
import Config from '@/config';

// Alert Message Component
const AlertMessage = ({ type, message, onClose }: { 
  type: 'error' | 'success'; 
  message: string; 
  onClose: () => void;
}) => (
  <div className={`mb-6 border rounded-lg px-4 py-3 flex items-center gap-2 ${
    type === 'error' 
      ? 'bg-red-50 border-red-200 text-red-700' 
      : 'bg-green-50 border-green-200 text-green-700'
  }`}>
    {type === 'error' ? (
      <MdError className="w-5 h-5 text-red-500" />
    ) : (
      <MdCheckCircle className="w-5 h-5 text-green-500" />
    )}
    <span className="flex-1">{message}</span>
    <button 
      onClick={onClose}
      className={`${type === 'error' ? 'text-red-400 hover:text-red-600' : 'text-green-400 hover:text-green-600'} transition-colors`}
    >
      <MdClose className="w-4 h-4" />
    </button>
  </div>
);

export default function FlowPage() {
  // Wizard state
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ['Upload', 'Summarize', 'Edit', 'Email'];
  
  // Main application state
  const [transcript, setTranscript] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [summary, setSummary] = useState('');
  const [editableSummary, setEditableSummary] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // Email state
  const [emailRecipients, setEmailRecipients] = useState<string[]>([]);
  const [emailSubject, setEmailSubject] = useState('Meeting Summary - RecapFlow');
  const [includeTranscript, setIncludeTranscript] = useState(false);
  
  // Email signature state
  const [senderName, setSenderName] = useState('');
  const [senderTitle, setSenderTitle] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderCompany, setSenderCompany] = useState('');
  const [senderWebsite, setSenderWebsite] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // API Configuration from environment
  const API_BASE = Config.API_BASE_URL;

  // Load signature data from localStorage on component mount
  React.useEffect(() => {
    const savedSignature = localStorage.getItem('recapflow-signature');
    if (savedSignature) {
      try {
        const signature = JSON.parse(savedSignature);
        setSenderName(signature.name || '');
        setSenderTitle(signature.title || '');
        setSenderEmail(signature.email || '');
        setSenderPhone(signature.phone || '');
        setSenderCompany(signature.company || '');
        setSenderWebsite(signature.website || '');
      } catch (error) {
        console.error('Error parsing saved signature:', error);
      }
    }
  }, []);

  // Note: Signature saving is now handled in EmailStep component when user clicks send
  // This ensures save only happens when user actually attempts to send email

  // Utility function to escape tilde characters to prevent markdown strikethrough
  const escapeTildes = (text: string): string => {
    // Replace standalone tildes with escaped version to prevent strikethrough
    return text.replace(/~/g, '\\~');
  };

  // File upload handler
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    setLoading(true);
    setError('');
    clearMessages();
    
    // Show loading toast
    const loadingToast = toast.loading('📁 Uploading file...', {
      style: {
        borderRadius: '10px',
        background: colors.darkPurple,
        color: '#fff',
      },
    });
    
    try {
      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      setTranscript(data.transcript);
      
      // Success toast
      toast.success('📄 File uploaded successfully!', {
        id: loadingToast,
        style: {
          borderRadius: '10px',
          background: '#10B981',
          color: '#fff',
        },
        duration: 3000,
      });
      setSuccess('File uploaded successfully!');
    } catch (err: any) {
      // Error toast
      toast.error(`❌ Upload failed: ${err.message}`, {
        id: loadingToast,
        style: {
          borderRadius: '10px',
          background: '#EF4444',
          color: '#fff',
        },
        duration: 4000,
      });
      setError(`Upload failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Summarize transcript
  const handleSummarize = async () => {
    if (!transcript.trim()) {
      toast.error('📝 Please provide a transcript first', {
        style: {
          borderRadius: '10px',
          background: '#EF4444',
          color: '#fff',
        },
        duration: 3000,
      });
      setError('Please provide a transcript first');
      return;
    }
    
    setLoading(true);
    setError('');
    clearMessages();
    
    // Show loading toast
    const loadingToast = toast.loading('🤖 AI is analyzing your transcript...', {
      style: {
        borderRadius: '10px',
        background: colors.darkPurple,
        color: '#fff',
      },
    });
    
    try {
      const response = await fetch(`${API_BASE}/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          custom_prompt: customPrompt,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Summarization failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      const escapedSummary = escapeTildes(data.summary);
      setSummary(escapedSummary); // Keep formatted markdown for display
      setEditableSummary(escapedSummary); // Keep raw markdown for editing
      
      // Success toast
      toast.success('✨ Summary generated successfully!', {
        id: loadingToast,
        style: {
          borderRadius: '10px',
          background: '#10B981',
          color: '#fff',
        },
        duration: 3000,
      });
      setSuccess('Summary generated successfully!');
      
      // Scroll to top to show the generated summary
      scrollToTop();
    } catch (err: any) {
      // Error toast
      toast.error(`🚨 Summarization failed: ${err.message}`, {
        id: loadingToast,
        style: {
          borderRadius: '10px',
          background: '#EF4444',
          color: '#fff',
        },
        duration: 4000,
      });
      setError(`Summarization failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Save edited summary
  const handleSaveEdit = (newSummary?: string) => {
    // Use the provided newSummary or fall back to editableSummary
    const summaryToSave = newSummary || editableSummary;
    const escapedSummary = escapeTildes(summaryToSave);
    setSummary(escapedSummary);
    setEditableSummary(escapedSummary);
    setIsEditing(false);
    setSuccess('Summary updated successfully!');
  };

  // Send email
  const handleSendEmail = async (emailData?: any) => {
    if (emailRecipients.length === 0) {
      toast.error('📧 Please add at least one recipient', {
        style: {
          borderRadius: '10px',
          background: '#EF4444',
          color: '#fff',
        },
        duration: 3000,
      });
      setError('Please add at least one recipient');
      return;
    }
    
    setLoading(true);
    setError('');
    clearMessages();
    
    // Show loading toast
    const loadingToast = toast.loading('📧 Sending your email...', {
      style: {
        borderRadius: '10px',
        background: colors.darkPurple,
        color: '#fff',
      },
    });
    
    try {
      // Use emailData if provided, otherwise use existing summary
      const emailContent = emailData?.emailContent || summary;
      
      const response = await fetch(`${API_BASE}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients: emailRecipients,
          summary: emailContent,
          subject: emailSubject,
          include_transcript: includeTranscript,
          original_transcript: includeTranscript ? transcript : null,
          sender_details: emailData?.senderDetails || null,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Email sending failed: ${response.statusText}`);
      }
      
      // Success toast
      toast.success(`📨 Email sent successfully to ${emailRecipients.length} recipient${emailRecipients.length > 1 ? 's' : ''}!`, {
        id: loadingToast,
        style: {
          borderRadius: '10px',
          background: '#10B981',
          color: '#fff',
        },
        duration: 4000,
      });
      setSuccess(`Email sent successfully to ${emailRecipients.length} recipients!`);
      
      // Scroll to top to show success message
      scrollToTop();
    } catch (err: any) {
      // Error toast
      toast.error(`🚨 Email sending failed: ${err.message}`, {
        id: loadingToast,
        style: {
          borderRadius: '10px',
          background: '#EF4444',
          color: '#fff',
        },
        duration: 4000,
      });
      setError(`Email sending failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Utility function to scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Navigation functions
  const nextStep = () => {
    clearMessages();
    setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
    scrollToTop();
  };
  
  const prevStep = () => {
    clearMessages();
    setCurrentStep(Math.max(currentStep - 1, 0));
    scrollToTop();
  };
  
  const goToStep = (step: number) => {
    clearMessages();
    setCurrentStep(step);
    scrollToTop();
  };

  // Clear success/error messages
  const clearMessages = () => {
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Toast Container */}
      <Toaster position="top-center" />
      
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-between mb-4">
            <Link 
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <MdArrowBack className="text-xl" />
              <span className="text-sm">Back to Home</span>
            </Link>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <MdAutoGraph className="text-4xl sm:text-5xl text-blue-600" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              RecapFlow
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600">Transform meetings into insights in minutes</p>
        </div>

        {/* Alert Messages */}
        {(error || success) && (
          <AlertMessage 
            type={error ? 'error' : 'success'} 
            message={error || success} 
            onClose={() => {
              setError('');
              setSuccess('');
            }}
          />
        )}

        {/* Step Indicator */}
        <StepIndicator 
          steps={steps}
          currentStep={currentStep}
          onStepClick={goToStep}
        />

        {/* Quick Navigation */}
        <QuickNavigation 
          currentStep={currentStep}
          steps={steps}
          onPrevious={prevStep}
          onNext={nextStep}
          loading={loading}
        />

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden p-4 sm:p-6 lg:p-8">
          {currentStep === 0 && (
            <UploadStep 
              onFileUpload={handleFileUpload}
              transcript={transcript}
              setTranscript={setTranscript}
              loading={loading}
              onNext={nextStep}
              onPrevious={prevStep}
            />
          )}

          {currentStep === 1 && (
            <SummarizeStep 
              transcript={transcript}
              customPrompt={customPrompt}
              setCustomPrompt={setCustomPrompt}
              summary={summary}
              onSummarize={handleSummarize}
              loading={loading}
              onNext={nextStep}
              onPrevious={prevStep}
            />
          )}

          {currentStep === 2 && (
            <EditStep 
              summary={summary}
              editableSummary={editableSummary}
              setEditableSummary={setEditableSummary}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              onSaveEdit={handleSaveEdit}
              loading={loading}
              onNext={nextStep}
              onPrevious={prevStep}
            />
          )}

          {currentStep === 3 && (
            <EmailStep 
              emailRecipients={emailRecipients}
              setEmailRecipients={setEmailRecipients}
              emailSubject={emailSubject}
              setEmailSubject={setEmailSubject}
              includeTranscript={includeTranscript}
              setIncludeTranscript={setIncludeTranscript}
              summary={summary}
              transcript={transcript}
              onSendEmail={handleSendEmail}
              loading={loading}
              onNext={nextStep}
              onPrevious={prevStep}
              senderName={senderName}
              setSenderName={setSenderName}
              senderTitle={senderTitle}
              setSenderTitle={setSenderTitle}
              senderEmail={senderEmail}
              setSenderEmail={setSenderEmail}
              senderPhone={senderPhone}
              setSenderPhone={setSenderPhone}
              senderCompany={senderCompany}
              setSenderCompany={setSenderCompany}
              senderWebsite={senderWebsite}
              setSenderWebsite={setSenderWebsite}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>
            Built with ❤️ for better meetings by{' '}
            <a 
              href="https://ashwithrai.me" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:text-blue-800 transition-colors underline"
            >
              Ashwith Rai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
