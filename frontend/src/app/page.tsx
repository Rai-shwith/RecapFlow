import Link from 'next/link';
import { 
  MdUpload, 
  MdAutoAwesome, 
  MdEdit, 
  MdEmail,
  MdArrowForward,
  MdAutoGraph,
  MdSecurity,
  MdSpeed,
  MdDone
} from 'react-icons/md';
import DemoModal from '@/components/DemoModal';

export default function HomePage() {
  const features = [
    {
      icon: <MdSecurity className="w-8 h-8" />,
      title: "Secure & Private",
      description: "Your data is processed securely with no storage of sensitive information"
    },
    {
      icon: <MdSpeed className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "AI-powered summarization in seconds, not minutes"
    },
    {
      icon: <MdEmail className="w-8 h-8" />,
      title: "Professional Sharing",
      description: "Send beautifully formatted summaries via email with custom signatures"
    }
  ];

  const workflowSteps = [
    {
      icon: <MdUpload className="w-12 h-12" />,
      title: "Upload",
      description: "Upload your meeting transcript or paste text directly",
      details: "Supports .txt, .md, and .docx files"
    },
    {
      icon: <MdAutoAwesome className="w-12 h-12" />,
      title: "Summarize", 
      description: "AI generates intelligent summaries with custom prompts",
      details: "Powered by Google Gemini AI for accurate insights"
    },
    {
      icon: <MdEdit className="w-12 h-12" />,
      title: "Edit",
      description: "Review and customize your summary before sharing",
      details: "Full markdown editing with live preview"
    },
    {
      icon: <MdEmail className="w-12 h-12" />,
      title: "Share",
      description: "Send professional emails with summaries and attachments",
      details: "Custom sender details, multiple recipients, optional transcript inclusion"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MdAutoGraph className="text-4xl text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              RecapFlow
            </span>
          </div>
          <Link 
            href="/flow"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            Try Now <MdArrowForward />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Transform Meetings Into
          <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Actionable Insights
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          AI-powered transcript summarization that turns lengthy meeting notes into concise, 
          professional summaries ready to share via email in minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/flow"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-medium text-lg transition-colors flex items-center justify-center gap-2"
          >
            Start Summarizing <MdArrowForward />
          </Link>
          <DemoModal />
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 text-center">
              <div className="text-blue-600 mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple 4-step process to transform your meeting transcripts into professional summaries
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {workflowSteps.map((step, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 relative">
              {/* Step number */}
              <div className="absolute -top-4 -left-4 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
              
              {/* Icon */}
              <div className="text-blue-600 mb-4">
                {step.icon}
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600 mb-3">{step.description}</p>
              <p className="text-sm text-blue-600 font-medium">{step.details}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Email Integration Highlight */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <MdEmail className="w-16 h-16 text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Professional Email Integration</h2>
            <p className="text-lg text-gray-600 mb-8">
              RecapFlow doesn&apos;t just create summaries – it delivers them professionally. 
              Send beautifully formatted emails with custom sender details, multiple recipients, 
              and optional original transcript attachments.
            </p>
            
            <div className="bg-gray-50 rounded-xl p-6 text-left max-w-2xl mx-auto">
              <h4 className="font-semibold text-gray-900 mb-4">Email Features:</h4>
              <div className="space-y-2">
                {[
                  "Custom sender signatures with company details",
                  "Multiple recipients support",
                  "Professional HTML formatting", 
                  "Optional original transcript inclusion",
                  "Automatic email templates",
                  "Local storage for sender preferences"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <MdDone className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Link 
              href="/flow"
              className="mt-8 inline-flex bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-medium transition-colors items-center gap-2"
            >
              Try Email Integration <MdArrowForward />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Meetings?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start creating professional meeting summaries in minutes, not hours.
          </p>
          <Link 
            href="/flow"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-medium text-lg transition-colors inline-flex items-center gap-2"
          >
            Get Started Free <MdArrowForward />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-500 text-sm border-t border-gray-200">
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
      </footer>
    </div>
  );
}
