'use client';

import { useState, useEffect, useRef } from 'react';

interface InstructionsProps {
  instructions: string;
  isVisible: boolean;
  onToggle: () => void;
}

export default function Instructions({ instructions, isVisible, onToggle }: InstructionsProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Cleanup speech when component unmounts
    return () => {
      if (speechRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleVoiceToggle = () => {
    if (isMuted || isSpeaking) {
      // Stop speaking
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsMuted(false);
    } else {
      // Start speaking
      const utterance = new SpeechSynthesisUtterance(instructions);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsMuted(false);
    }
  };

  const handleCollapseToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  };

  return (
    <div className="mt-6 bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between p-4">
        <h3 className="text-lg font-semibold text-blue-600">Instructions</h3>
        <div className="flex items-center space-x-2">
          <button 
            className={`p-2 hover:bg-gray-200 rounded-full transition-colors ${isSpeaking ? 'text-blue-600' : isMuted ? 'text-gray-400' : 'text-gray-600'}`}
            onClick={handleVoiceToggle}
            title={isSpeaking ? 'Stop speaking' : isMuted ? 'Unmute' : 'Speak instructions'}
          >
            {isSpeaking ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
            ) : isMuted ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
          <button 
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            onClick={handleCollapseToggle}
            title={isVisible ? 'Collapse instructions' : 'Expand instructions'}
          >
            <svg 
              className={`w-4 h-4 transform transition-transform ${isVisible ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      
      {isVisible && (
        <div className="px-4 pb-4">
          <p className="text-gray-700 leading-relaxed">{instructions}</p>
        </div>
      )}
    </div>
  );
}
