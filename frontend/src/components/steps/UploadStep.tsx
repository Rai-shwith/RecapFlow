import React, { useCallback } from 'react';
import { colors } from '@/utils/colors';
import { LoadingButton } from '../QuickNavigation';
import { 
  MdUpload, 
  MdCloudUpload, 
  MdDescription, 
  MdArrowForward,
  MdArrowBack 
} from 'react-icons/md';

interface UploadStepProps {
  onFileUpload: (file: File) => void;
  transcript: string;
  setTranscript: (transcript: string) => void;
  loading: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

const UploadStep = ({ 
  onFileUpload, 
  transcript, 
  setTranscript, 
  loading,
  onNext,
  onPrevious
}: UploadStepProps) => {
  // Utility function to scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileUpload(files[0]);
    }
  }, [onFileUpload]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  const handleSampleText = () => {
    setTranscript(`Meeting Transcript – RecapFlow Development Session

Date: August 19, 2025
Participants: Ashwith, Arya, Arnav, Deeksha, Anagha, Archana, Abhay, Lavanya, Krupa

Ashwith:
Alright folks, quick update. The first version of RecapFlow was on React, hosted on Vercel. It worked fine, but I wasn’t happy with the SEO side of it. So I migrated the whole frontend to Next.js. Right now, I’m setting it up for Static Site Generation and planning to host on GitHub Pages. Honestly, from my experience, GitHub Pages feels way faster than Vercel.

Arya:
But bro, Vercel has better caching, no? Are you sure GitHub Pages can handle it when we scale?

Ashwith:
Yeah, that’s true in theory, but in practice I’ve seen GitHub Pages load quicker. For us, since it’s static content after generation, GitHub Pages makes sense. Plus, it’s free and reliable.

Krupa:
Wait—so the backend is still FastAPI, right? Where’s that hosted?

Ashwith:
Yeah, backend is FastAPI, running on Heroku. So frontend on GitHub Pages, backend on Heroku.

Abhay:
Makes sense. But if we’re going static, we should think about error handling carefully. Users might get confused if something fails silently.

Lavanya:
Yeah, we should add clear error messages and loading indicators. Right now, if someone uploads a huge transcript, it just feels stuck.

Deeksha:
And while you’re fixing that, can we also give the dashboard a refresh? The current design is too plain. Maybe a gradient theme would make it look modern.

Anagha:
Agree. And I’d love to add some small animations. Like the “Summarize” button glowing when hovered. Just enough to make it interactive.

Arnav:
Looks are good, but let’s also talk about pitching. If we keep polishing the UX, we can easily market this to colleges and startups. Imagine professors uploading lecture transcripts and students instantly getting a recap.

Archana:
If we’re going after colleges and companies, then we need to handle privacy properly. People might upload sensitive content. We should auto-delete transcripts after summarization.

Arya:
Good point. Also, in the future, we could still containerize everything with Docker. That way, whether it’s GitHub Pages or Vercel, we’ll have flexibility.

Krupa:
Can I throw in another idea? What if we add multi-label summaries — like not just a single “summary,” but also sections for “Action Items,” “Key Points,” and “Decisions.” That would make RecapFlow more than just another summarizer.

Ashwith:
I like that. Multi-label support could be a big differentiator.

Abhay:
And multilingual support too. Imagine someone uploading a Hindi or Kannada transcript and still getting perfect summaries. That’d be huge.

Deeksha (laughing):
True. But let’s first finalize the colors before you add ten languages.

Anagha:
And no Comic Sans, please.

Everyone: (laughs)

Arnav:
Anyway, if this goes well, I’ll start drafting a pitch. We could even try getting some student clubs to beta test.

Ashwith:
Sounds good. So to sum up: frontend is moving to Next.js with SSG on GitHub Pages, backend stays on Heroku. Next steps — fix error handling, improve UX, work on privacy, explore Docker, and brainstorm multi-label + multilingual support.

Arnav:
And when we get investors, coffee’s on me.

Ashwith:
Deal. Meeting adjourned 🚀`);
    scrollToTop();
  };

  return (
    <div className="space-y-6">
      <h2 
        className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center text-gray-800"
      >
        Upload Your Transcript
      </h2>
      
      {/* File Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-all duration-200 hover:shadow-md cursor-pointer border-blue-200 hover:border-blue-300"
      >
        <div className="space-y-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto flex items-center justify-center bg-blue-50">
            <span className="text-xl sm:text-2xl">📄</span>
          </div>
          <div>
            <p className="text-base sm:text-lg font-medium text-gray-800">
              <span className="hidden sm:inline">Drag and drop your transcript file here</span>
              <span className="sm:hidden">Upload your transcript file</span>
            </p>
            <p 
              className="text-sm text-gray-500 mt-1"
            >
              Supports .txt, .md, and .docx files
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center justify-center">
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".txt,.md,.docx"
                onChange={handleFileSelect}
                className="hidden"
                disabled={loading}
              />
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white">
                <MdCloudUpload className="text-lg" />
                <span>Choose File</span>
              </div>
            </label>
            <span className="text-xs sm:text-sm text-gray-400">or</span>
            <p className="text-xs sm:text-sm text-gray-600">
              paste text below
            </p>
          </div>
        </div>
      </div>

      {/* Manual Text Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <MdDescription className="text-lg" />
            Or paste your transcript here:
          </label>
          <button
            onClick={handleSampleText}
            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            disabled={loading}
          >
            Load Sample
          </button>
        </div>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste your meeting transcript here..."
          className="w-full h-24 sm:h-32 p-3 sm:p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base text-gray-900 bg-white placeholder-gray-500"
          disabled={loading}
        />
      </div>

      {/* Character count */}
      {transcript && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {transcript.length} characters
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-end pt-4 sm:pt-6">
        <LoadingButton
          onClick={onNext}
          disabled={!transcript.trim()}
          className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
          style={{ 
            backgroundColor: transcript.trim() ? colors.primary : colors.gray[300],
            color: 'white'
          }}
        >
          <span className="hidden sm:inline">Continue to Summarize</span>
          <span className="sm:hidden">Continue</span>
        </LoadingButton>
      </div>
    </div>
  );
};

export default UploadStep;
