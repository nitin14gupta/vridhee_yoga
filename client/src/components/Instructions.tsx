interface InstructionsProps {
  instructions: string;
  isVisible: boolean;
  onToggle: () => void;
}

export default function Instructions({ instructions, isVisible, onToggle }: InstructionsProps) {
  return (
    <div className="mt-6 bg-white border border-gray-200 rounded-lg">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
        onClick={onToggle}
      >
        <h3 className="text-lg font-semibold text-gray-800">Instructions</h3>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-200 rounded-full">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-full">
            <svg className={`w-4 h-4 transform transition-transform ${isVisible ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
