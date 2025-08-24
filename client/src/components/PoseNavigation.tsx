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

export default function PoseNavigation({ poses, selectedPose, onPoseSelect }: PoseNavigationProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {poses.map((pose) => (
            <button
              key={pose.id}
              onClick={() => onPoseSelect(pose.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                pose.active
                  ? 'bg-green-100 text-green-700 border-2 border-green-300'
                  : pose.completed
                  ? 'bg-gray-100 text-gray-700 border-2 border-gray-300'
                  : 'bg-white text-gray-500 border-2 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {pose.name}
              {pose.completed && (
                <span className="ml-2 text-green-600">✓</span>
              )}
              {pose.active && (
                <span className="ml-2 text-green-600">✓</span>
              )}
            </button>
          ))}
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Analytics & Settings</span>
        </button>
      </div>
    </div>
  );
}
