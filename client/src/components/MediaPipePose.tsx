'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface MediaPipePoseProps {
  onPoseDetected: (landmarks: any, matchPercentage: number) => void;
  onVideoReady: (video: HTMLVideoElement) => void;
}

export default function MediaPipePose({ onPoseDetected, onVideoReady }: MediaPipePoseProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize MediaPipe Pose
  const initializePose = useCallback(async () => {
    try {
      if (!videoRef.current || !canvasRef.current) return;

      // Dynamic imports to avoid SSR issues
      const { Pose, POSE_CONNECTIONS } = await import('@mediapipe/pose');
      const { Camera } = await import('@mediapipe/camera_utils');
      const { drawConnectors, drawLandmarks } = await import('@mediapipe/drawing_utils');

      // Initialize Pose
      const pose = new Pose({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        }
      });

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      // Set up pose detection callback
      pose.onResults((results: any) => {
        if (results.poseLandmarks && canvasRef.current) {
          const canvasCtx = canvasRef.current.getContext('2d');
          if (canvasCtx) {
            // Clear canvas
            canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            
            // Draw skeleton overlay
            drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
              color: '#00FF00',
              lineWidth: 2
            });
            
            // Draw landmarks
            drawLandmarks(canvasCtx, results.poseLandmarks, {
              color: '#FFFFFF',
              lineWidth: 1,
              radius: 3
            });

            // Calculate match percentage (simplified for now)
            const matchPercentage = calculateMatchPercentage(results.poseLandmarks);
            
            // Notify parent component
            onPoseDetected(results.poseLandmarks, matchPercentage);
          }
        }
      });

      // Initialize camera
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (pose && videoRef.current) {
            await pose.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480
      });

      await camera.start();
      setIsInitialized(true);
      
      if (onVideoReady && videoRef.current) {
        onVideoReady(videoRef.current);
      }

    } catch (err) {
      console.error('Error initializing MediaPipe:', err);
      setError('Failed to initialize pose detection');
    }
  }, [onPoseDetected, onVideoReady]);

  // Calculate match percentage based on pose landmarks
  const calculateMatchPercentage = (landmarks: any): number => {
    if (!landmarks || landmarks.length === 0) return 0;

    // This is a simplified calculation - in a real app, you'd compare with reference pose
    // For now, we'll simulate based on pose confidence and landmark positions
    
    let totalConfidence = 0;
    let validLandmarks = 0;

    // Calculate average confidence of key landmarks
    const keyLandmarks = [11, 12, 23, 24, 25, 26]; // shoulders, hips, knees
    keyLandmarks.forEach(index => {
      if (landmarks[index] && landmarks[index].visibility > 0.5) {
        totalConfidence += landmarks[index].visibility;
        validLandmarks++;
      }
    });

    if (validLandmarks === 0) return 0;

    const avgConfidence = totalConfidence / validLandmarks;
    
    // Simulate pose accuracy based on confidence
    // In reality, you'd compare angles and positions with reference pose
    const baseAccuracy = avgConfidence * 100;
    const randomVariation = Math.random() * 10 - 5; // ±5% variation
    
    return Math.max(0, Math.min(100, baseAccuracy + randomVariation));
  };

  useEffect(() => {
    initializePose();
  }, [initializePose]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">Pose Detection Error</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
          <button 
            onClick={initializePose}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        className="w-full h-full object-cover rounded-lg"
        autoPlay
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full rounded-lg pointer-events-none"
        width={640}
        height={480}
      />
      {!isInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-lg">
          <div className="text-center text-white">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm">Initializing pose detection...</p>
          </div>
        </div>
      )}
    </div>
  );
}
