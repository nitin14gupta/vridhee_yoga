'use client';

import { useState, useEffect } from 'react';
import PoseNavigation from '../components/PoseNavigation';
import PoseDetails from '../components/PoseDetails';
import PoseViewer from '../components/PoseViewer';
import Instructions from '../components/Instructions';
import SmartTimer from '../components/SmartTimer';

export default function Home() {
  const [selectedPose, setSelectedPose] = useState(2);
  const [currentPose, setCurrentPose] = useState(2);
  const [instructionsVisible, setInstructionsVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [matchPercentage, setMatchPercentage] = useState(0);
  const [totalCorrectTime, setTotalCorrectTime] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(0);
  const [poseDetected, setPoseDetected] = useState(false);

  const yogaPoses = [
    { id: 1, name: "Yoga Pose 1", completed: true },
    { id: 2, name: "Yoga Pose 2", completed: false, active: selectedPose === 2 },
    { id: 3, name: "Yoga Pose 3", completed: false, active: selectedPose === 3 },
    { id: 4, name: "Yoga Pose 4", completed: true },
    { id: 5, name: "Yoga Pose 5", completed: false },
    { id: 6, name: "Yoga Pose 6", completed: true },
    { id: 7, name: "Yoga Pose 7", completed: true },
  ];

  const suryaNamaskarPoses = [
    { id: 1, name: "Surya Namaskar Pose 1" },
    { id: 2, name: "Surya Namaskar Pose 2 (Upward Dog)" },
    { id: 3, name: "Surya Namaskar Pose 3 (Hands Joined)" },
    { id: 4, name: "Surya Namaskar Pose 4" },
  ];

  const instructions = "Start in a tabletop position, with your hands and knees on the mat. Bring your right knee forward, placing the outer edge of the right shinbone and right buttock on the mat. Extend your left leg straight out behind you, with the top of the left knee, thigh, and ankle resting on the floor.";

  // Auto-start session when pose is detected and match is high
  useEffect(() => {
    if (poseDetected && matchPercentage >= 90 && !isPlaying) {
      setIsPlaying(true);
      setSessionStartTime(Date.now());
    }
  }, [poseDetected, matchPercentage, isPlaying]);

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setSessionStartTime(Date.now());
    }
  };

  const handleTimeUpdate = (time: string, correctTime: number) => {
    setCurrentTime(time);
    setTotalCorrectTime(correctTime);
  };

  const handlePoseDetected = (landmarks: any, matchPercentage: number) => {
    setMatchPercentage(matchPercentage);
    setPoseDetected(true);
  };

  // Calculate accuracy percentage
  const calculateAccuracy = () => {
    if (sessionStartTime === 0) return 0;
    const totalSessionTime = Math.floor((Date.now() - sessionStartTime) / 1000);
    if (totalSessionTime === 0) return 0;
    return Math.round((totalCorrectTime / totalSessionTime) * 100);
  };

  return (
    <div className="min-h-screen bg-white">
      <PoseNavigation 
        poses={yogaPoses}
        selectedPose={selectedPose}
        onPoseSelect={setSelectedPose}
      />

      <PoseDetails 
        poseName={suryaNamaskarPoses[currentPose - 1]?.name || "Surya Namaskar Pose 2"}
        currentTime={currentTime}
        totalTime="02:00"
        matchPercentage={matchPercentage}
        difficulty="Intermediate"
        isPlaying={isPlaying}
        onPlayToggle={handlePlayToggle}
      />

      <div className="flex-1 p-6">
        <PoseViewer 
          currentTime={currentTime} 
          onPoseDetected={handlePoseDetected}
          poseId={selectedPose === 3 ? 3 : 2}
        />
        
        <Instructions 
          instructions={instructions}
          isVisible={instructionsVisible}
          onToggle={() => setInstructionsVisible(!instructionsVisible)}
        />

        {/* Pose Status Indicator */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-4 h-4 rounded-full ${matchPercentage >= 90 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium">
                {matchPercentage >= 90 ? 'Pose Correct - Timer Running' : 'Pose Incorrect - Timer Paused'}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Accuracy: {calculateAccuracy()}%
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xs text-gray-500 mb-1">Match Percentage: {Math.round(matchPercentage)}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  matchPercentage >= 90 ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(100, matchPercentage)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Smart Timer Component */}
      <div className="hidden">
        <SmartTimer 
          isActive={isPlaying} 
          matchPercentage={matchPercentage}
          onTimeUpdate={handleTimeUpdate}
        />
      </div>
    </div>
  );
}
