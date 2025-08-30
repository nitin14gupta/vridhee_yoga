interface YogaPose {
  id: number;
  name: string;
  completed: boolean;
  active?: boolean;
}

interface PoseNavigationProps {
  poses: YogaPose[];
  selectedPose: number;
  onPoseSelect: (poseId: number) => void;
}

export default function PoseNavigation({ poses, onPoseSelect }: PoseNavigationProps) {
  return (
    <div className="bg-gray-50 px-4 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-5">
          {poses.map((pose) => (
            <button
              key={pose.id}
              onClick={() => onPoseSelect(pose.id)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-3 ${
                pose.active
                  ? 'bg-green-100 text-blue-800 border-2 border-green-200 shadow-sm'
                  : pose.completed
                  ? 'bg-white text-gray-700 border-2 border-gray-200'
                  : 'bg-white text-gray-500 border-2 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {(pose.completed || pose.active) && (
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  pose.active ? 'bg-green-500' : 'bg-gray-600'
                }`}>
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <span>{pose.name}</span>
            </button>
          ))}
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-full flex items-center space-x-3 hover:bg-blue-700 transition-colors">
          <span>Analytics & Settings</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
