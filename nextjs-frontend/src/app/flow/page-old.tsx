'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MdArrowBack, MdAutoGraph } from 'react-icons/md';

export default function FlowPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <MdAutoGraph className="text-3xl sm:text-4xl text-blue-600" />
            <Link href="/" className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              RecapFlow
            </Link>
          </div>
          <Link 
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <MdArrowBack />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Home</span>
          </Link>
        </div>

        {/* Coming Soon Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            RecapFlow App Coming Soon!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            We&apos;re currently migrating our powerful wizard interface from React to Next.js for better SEO and performance.
          </p>
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">What&apos;s Coming:</h3>
            <ul className="text-blue-800 text-left max-w-md mx-auto space-y-1">
              <li>• Enhanced file upload with drag & drop</li>
              <li>• AI-powered summarization with custom prompts</li>
              <li>• Real-time editing with markdown preview</li>
              <li>• Professional email sharing with signatures</li>
              <li>• Improved mobile responsiveness</li>
              <li>• Better SEO and performance</li>
            </ul>
          </div>
          <p className="text-gray-500 text-sm">
            Migration in progress... Check back soon!
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>
            Built with ❤️ for better meetings by{' '}
            <a 
              href="https://github.com/Rai-shwith" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:text-blue-800 transition-colors underline"
            >
              Rai-shwith
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
