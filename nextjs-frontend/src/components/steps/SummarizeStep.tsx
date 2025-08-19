import React from 'react';
import { colors } from '@/utils/colors';
import { LoadingButton } from '../QuickNavigation';
import { MdAutoAwesome, MdDescription, MdStar } from 'react-icons/md';
import { marked } from 'marked';

// Loading Bar Component
const LoadingBar = () => (
  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
  </div>
);

// Summary Viewer Component with proper markdown rendering
const SummaryViewer = ({ summary, title }: { summary: string; title: string }) => {
  // Configure marked options for better styling
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  const renderMarkdown = (markdown: string) => {
    try {
      return marked(markdown);
    } catch (error) {
      console.error('Markdown parsing error:', error);
      return markdown.replace(/\n/g, '<br/>');
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <MdStar className="text-blue-600" />
        {title}
      </h4>
      <div 
        className="prose prose-sm max-w-none markdown-content md:h-[90vh] overflow-scroll"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(summary) }}
      />
    </div>
  );
};

interface SummarizeStepProps {
  transcript: string;
  customPrompt: string;
  setCustomPrompt: (prompt: string) => void;
  summary: string;
  onSummarize: () => void;
  loading: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

const SummarizeStep = ({ 
  transcript, 
  customPrompt, 
  setCustomPrompt, 
  summary, 
  onSummarize, 
  loading,
  onNext,
  onPrevious
}: SummarizeStepProps) => {
  return (
    <div className="space-y-6">
      <h2 
        className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center text-gray-800"
      >
        Generate AI Summary
      </h2>

      {/* Loading bar when generating */}
      {loading && (
        <div className="space-y-2">
          <LoadingBar />
          <p className="text-sm text-center text-gray-600">
            AI is analyzing your transcript...
          </p>
        </div>
      )}

      {/* Transcript Preview */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">
          Your Transcript ({transcript.length} characters):
        </label>
        <div className="p-4 rounded-lg max-h-40 overflow-y-auto text-sm bg-blue-50 border border-blue-200 text-gray-700">
          {transcript}
        </div>
      </div>

      {/* Custom Prompt */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">
          Custom Instructions (Optional):
        </label>
        <textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="e.g., Focus on action items and decisions made..."
          className="w-full h-20 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white placeholder-gray-500"
          disabled={loading}
        />
        <p className="text-xs text-gray-500 mt-1">
          Tip: Be specific about what you want to highlight in the summary
        </p>
      </div>

      {/* Generated Summary */}
      {summary && (
        <SummaryViewer 
          summary={summary} 
          title="Generated Summary"
        />
      )}

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between pt-4 sm:pt-6 gap-4">
        <button
          onClick={onPrevious}
          disabled={loading}
          className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50 text-sm sm:text-base order-2 sm:order-1 bg-gray-200 text-gray-700"
        >
          Back
        </button>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 order-1 sm:order-2">
          <LoadingButton
            onClick={onSummarize}
            loading={loading}
            disabled={!transcript.trim()}
            className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
            style={{ 
              backgroundColor: colors.primary,
              color: 'white'
            }}
          >
            <MdAutoAwesome className="text-lg" />
            <span className="hidden sm:inline">Generate Summary</span>
            <span className="sm:hidden">Generate</span>
          </LoadingButton>
          <LoadingButton
            onClick={onNext}
            disabled={!summary}
            className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
            style={{ 
              backgroundColor: summary ? colors.primary : colors.gray[300],
              color: 'white'
            }}
          >
            <span className="hidden sm:inline">Continue to Edit</span>
            <span className="sm:hidden">Continue</span>
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default SummarizeStep;
