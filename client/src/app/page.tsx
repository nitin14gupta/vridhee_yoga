'use client';

import { useState, useEffect } from 'react';
import PoseNavigation from '../components/PoseNavigation';
import PoseDetails from '../components/PoseDetails';
import PoseViewer from '../components/PoseViewer';
import Instructions from '../components/Instructions';

export default function Home() {
  const [selectedPose, setSelectedPose] = useState(2);
  const [currentPose, setCurrentPose] = useState(2);
  const [instructionsVisible, setInstructionsVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [matchPercentage, setMatchPercentage] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(0);
  const [poseDetected, setPoseDetected] = useState(false);

  const yogaPoses = [
    { id: 1, name: "Yoga Pose 1", completed: true },
    { id: 2, name: "Yoga Pose 2", completed: false, active: selectedPose === 2 },
    { id: 3, name: "Yoga Pose 3", completed: true },
    { id: 4, name: "Yoga Pose 4", completed: true },
    { id: 5, name: "Yoga Pose 5", completed: true },
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

  const handlePoseDetected = (landmarks: any, matchPercentage: number) => {
    setMatchPercentage(matchPercentage);
    setPoseDetected(true);
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

      <div className="flex-1 bg-gray-50 px-6 py-6 pt-0">
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
      </div>

    </div>
  );
}
