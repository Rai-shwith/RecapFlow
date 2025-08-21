'use client';

import { useState } from 'react';
import { MdClose, MdPlayArrow } from 'react-icons/md';

interface DemoModalProps {
  className?: string;
}

export default function DemoModal({ className }: DemoModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      {/* Demo Button */}
      <button 
        onClick={openModal}
        className={`border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-xl font-medium text-lg transition-colors flex items-center justify-center gap-2 cursor-pointer ${className || ''}`}
      >
        <MdPlayArrow className="w-5 h-5" />
        View Demo
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">RecapFlow Demo</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <MdClose className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg border-0"
                  src="https://www.youtube.com/embed/MGnnq_zM0Mw?si=qsmpoGoi6IJRjkqG"
                  title="RecapFlow Demo Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              
              {/* Optional description */}
              <div className="mt-4 text-center">
                <p className="text-gray-600">
                  See how RecapFlow transforms meeting transcripts into professional summaries in minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal backdrop click handler */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={closeModal}
          aria-hidden="true"
        />
      )}
    </>
  );
}
