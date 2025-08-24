import Image from "next/image";
import MediaPipePose from "./MediaPipePose";

interface PoseViewerProps {
  currentTime: string;
  onPoseDetected: (landmarks: any, matchPercentage: number) => void;
}

export default function PoseViewer({ currentTime, onPoseDetected }: PoseViewerProps) {
  const handleVideoReady = (video: HTMLVideoElement) => {
    console.log('Video stream ready for AI analysis');
  };

  return (
    <div className="grid grid-cols-2 gap-6 h-96">
      {/* Left Panel - AI Analyzed Pose */}
      <div className="bg-gray-100 rounded-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-blue-400/20 z-10 pointer-events-none"></div>
        <div className="relative h-full">
          <MediaPipePose 
            onPoseDetected={onPoseDetected}
            onVideoReady={handleVideoReady}
          />
          
          {/* AI Timer */}
          <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1 z-20">
            <span>{currentTime}</span>
            <span>Ai</span>
          </div>
          
          {/* AI Status Overlay */}
          <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded text-sm z-20">
            AI Active
          </div>
        </div>
      </div>

      {/* Right Panel - Reference Pose */}
      <div className="bg-gray-100 rounded-lg relative overflow-hidden">
        <div className="relative h-full flex items-center justify-center p-4">
          <div className="relative w-full h-full">
            <Image 
              src="/images/yoga_pose.jpg" 
              alt="Yoga Handstand Pose Reference" 
              fill
              className="object-cover rounded-lg"
              priority
            />
            {/* Overlay for better text visibility */}
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
              Reference Pose
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
