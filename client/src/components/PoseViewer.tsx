import Image from "next/image";
import MediaPipePose from "./MediaPipePose";
import { UPWARD_DOG_REFERENCE, HANDS_JOINED_REFERENCE, type ReferenceAngles } from "./poseReference";
import { useRef, useState } from "react";

interface PoseViewerProps {
  currentTime: string;
  onPoseDetected: (landmarks: any, matchPercentage: number) => void;
  poseId?: number; // 2 = upward dog, 3 = hands joined
}

export default function PoseViewer({ currentTime, onPoseDetected, poseId = 2 }: PoseViewerProps) {
  const [customReference, setCustomReference] = useState<ReferenceAngles | null>(null);
  const lastAnglesRef = useRef<ReferenceAngles | null>(null);
  const handleVideoReady = (video: HTMLVideoElement) => {
    console.log('Video stream ready for AI analysis');
  };

  const defaultRef: ReferenceAngles = poseId === 3 ? HANDS_JOINED_REFERENCE : UPWARD_DOG_REFERENCE;
  const reference: ReferenceAngles = customReference || defaultRef;
  const referenceImageSrc = poseId === 3 ? "/images/handjoinpose.jpg" : "/images/yoga_pose.jpg";

  return (
    <div className="flex gap-6 h-136 bg-gray-50">
      {/* Left Panel - AI Analyzed Pose */}
      <div className="flex-1 bg-gray-100 rounded-lg relative overflow-hidden shadow-[2px_0_10px_rgba(0,0,0,0.1)]">
        <div className="relative h-full">
          <MediaPipePose 
            onPoseDetected={onPoseDetected}
            onVideoReady={handleVideoReady}
            referenceAngles={reference}
            onAnglesComputed={(a)=>{ lastAnglesRef.current = a; }}
          />
          
          {/* AI Timer - Red dot with time and "Ai" text */}
          <div className="absolute top-4 right-4 flex items-center space-x-2 z-20">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-white bg-black bg-opacity-50 px-2 py-1 rounded text-sm font-medium">
              {currentTime}
            </span>
            <span className="text-white bg-black bg-opacity-50 px-2 py-1 rounded text-sm font-medium">
              Ai
            </span>
          </div>
        </div>
      </div>

      {/* Right Panel - Reference Pose */}
      <div className="flex-1 bg-gray-100 rounded-lg relative overflow-hidden shadow-[-2px_0_10px_rgba(0,0,0,0.1)]">
        <div className="relative h-full">
          <Image 
            src={referenceImageSrc} 
            alt="Reference Pose" 
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
