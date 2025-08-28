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
    <div className="grid grid-cols-2 gap-6 h-96">
      {/* Left Panel - AI Analyzed Pose */}
      <div className="bg-gray-100 rounded-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-blue-400/20 z-10 pointer-events-none"></div>
        <div className="relative h-full">
          <MediaPipePose 
            onPoseDetected={onPoseDetected}
            onVideoReady={handleVideoReady}
            referenceAngles={reference}
            onAnglesComputed={(a)=>{ lastAnglesRef.current = a; }}
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
              src={referenceImageSrc} 
              alt="Reference Pose" 
              fill
              className="object-cover rounded-lg"
              priority
            />
            {/* Overlay for better text visibility */}
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm flex items-center space-x-2">
              <span>Reference Pose</span>
              <button 
                className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded"
                onClick={()=>{ if (lastAnglesRef.current) setCustomReference(lastAnglesRef.current); }}
              >Set current as reference</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
