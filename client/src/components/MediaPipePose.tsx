'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { LM, UPWARD_DOG_REFERENCE, JOINT_WEIGHTS, JOINT_TOLERANCE_DEG, type ReferenceAngles } from './poseReference';

interface MediaPipePoseProps {
  onPoseDetected: (landmarks: any, matchPercentage: number) => void;
  onVideoReady: (video: HTMLVideoElement) => void;
  referenceAngles?: ReferenceAngles;
  onAnglesComputed?: (angles: ReferenceAngles) => void; // expose angles to parent
}

export default function MediaPipePose({ onPoseDetected, onVideoReady, referenceAngles, onAnglesComputed }: MediaPipePoseProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const prevAnglesRef = useRef<ReferenceAngles | null>(null);
  const smoothingAlpha = 0.4; // EMA factor
  const lastJointDiffsRef = useRef<Partial<Record<keyof ReferenceAngles, number>> | null>(null);

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

            // Calculate match percentage against reference
            const matchPercentage = calculateMatchPercentage(results.poseLandmarks);

            // Overlay traffic-light dots for key joints based on last diffs
            const diffs = lastJointDiffsRef.current;
            if (diffs) {
              const mark = (idx: number, diff: number | undefined) => {
                if (!results.poseLandmarks[idx] || diff === undefined) return;
                const lm = results.poseLandmarks[idx];
                const x = lm.x * canvasRef.current!.width;
                const y = lm.y * canvasRef.current!.height;
                const ok = diff <= JOINT_TOLERANCE_DEG * 0.5;
                const warn = diff <= JOINT_TOLERANCE_DEG;
                canvasCtx.beginPath();
                canvasCtx.arc(x, y, 6, 0, Math.PI * 2);
                canvasCtx.fillStyle = ok ? '#22c55e' : (warn ? '#eab308' : '#ef4444');
                canvasCtx.fill();
              };
              mark(LM.LEFT_SHOULDER, diffs.leftShoulder);
              mark(LM.RIGHT_SHOULDER, diffs.rightShoulder);
              mark(LM.LEFT_ELBOW, diffs.leftElbow);
              mark(LM.RIGHT_ELBOW, diffs.rightElbow);
              mark(LM.LEFT_HIP, diffs.leftHip);
              mark(LM.RIGHT_HIP, diffs.rightHip);
              mark(LM.LEFT_KNEE, diffs.leftKnee);
              mark(LM.RIGHT_KNEE, diffs.rightKnee);
            }
            
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

  // Calculate match percentage based on pose landmarks vs reference angles
  const calculateMatchPercentage = (landmarks: any): number => {
    if (!landmarks || landmarks.length === 0) return 0;

    // Helper to compute 2D angle at joint B formed by A-B-C
    const angleAt = (a: any, b: any, c: any): number => {
      const v1x = a.x - b.x; const v1y = a.y - b.y;
      const v2x = c.x - b.x; const v2y = c.y - b.y;
      const dot = v1x * v2x + v1y * v2y;
      const mag1 = Math.hypot(v1x, v1y);
      const mag2 = Math.hypot(v2x, v2y);
      if (mag1 === 0 || mag2 === 0) return 0;
      const cos = Math.min(1, Math.max(-1, dot / (mag1 * mag2)));
      return (Math.acos(cos) * 180) / Math.PI;
    };

    // Midpoints for torso tilt
    const midpoint = (p1: any, p2: any) => ({ x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 });
    const angleOfLine = (p1: any, p2: any): number => {
      const dy = p2.y - p1.y;
      const dx = p2.x - p1.x;
      const ang = (Math.atan2(dy, dx) * 180) / Math.PI; // -180..180 relative to +x (horizontal)
      return Math.abs(ang); // compare with small values for near-horizontal
    };

    // Build current angles
    // Raw angles
    const rawAngles: ReferenceAngles = {
      leftElbow: angleAt(landmarks[LM.LEFT_SHOULDER], landmarks[LM.LEFT_ELBOW], landmarks[LM.LEFT_WRIST]),
      rightElbow: angleAt(landmarks[LM.RIGHT_SHOULDER], landmarks[LM.RIGHT_ELBOW], landmarks[LM.RIGHT_WRIST]),
      leftShoulder: angleAt(landmarks[LM.LEFT_ELBOW], landmarks[LM.LEFT_SHOULDER], landmarks[LM.LEFT_HIP]),
      rightShoulder: angleAt(landmarks[LM.RIGHT_ELBOW], landmarks[LM.RIGHT_SHOULDER], landmarks[LM.RIGHT_HIP]),
      leftHip: angleAt(landmarks[LM.LEFT_SHOULDER], landmarks[LM.LEFT_HIP], landmarks[LM.LEFT_KNEE]),
      rightHip: angleAt(landmarks[LM.RIGHT_SHOULDER], landmarks[LM.RIGHT_HIP], landmarks[LM.RIGHT_KNEE]),
      leftKnee: angleAt(landmarks[LM.LEFT_HIP], landmarks[LM.LEFT_KNEE], landmarks[LM.LEFT_ANKLE]),
      rightKnee: angleAt(landmarks[LM.RIGHT_HIP], landmarks[LM.RIGHT_KNEE], landmarks[LM.RIGHT_ANKLE]),
      torsoTilt: angleOfLine(
        midpoint(landmarks[LM.LEFT_SHOULDER], landmarks[LM.RIGHT_SHOULDER]),
        midpoint(landmarks[LM.LEFT_HIP], landmarks[LM.RIGHT_HIP])
      )
    };

    // Expose raw angles
    if (onAnglesComputed) onAnglesComputed(rawAngles);

    // Smooth with EMA
    const prev = prevAnglesRef.current;
    const current: ReferenceAngles = prev
      ? (Object.keys(rawAngles) as Array<keyof ReferenceAngles>).reduce((acc, k) => {
          acc[k] = prev[k] * (1 - smoothingAlpha) + rawAngles[k] * smoothingAlpha;
          return acc;
        }, {} as ReferenceAngles)
      : rawAngles;
    prevAnglesRef.current = current;

    const reference = referenceAngles || UPWARD_DOG_REFERENCE;

    // Weighted score per joint using linear falloff within tolerance
    // Scoring function with option to mirror left/right
    const computeScore = (useMirrored: boolean) => {
      const a = { ...current } as ReferenceAngles;
      if (useMirrored) {
        const swap = (k1: keyof ReferenceAngles, k2: keyof ReferenceAngles) => {
          const tmp = a[k1]; a[k1] = a[k2]; a[k2] = tmp;
        };
        swap('leftElbow', 'rightElbow');
        swap('leftShoulder', 'rightShoulder');
        swap('leftHip', 'rightHip');
        swap('leftKnee', 'rightKnee');
      }

      const keys = Object.keys(reference) as Array<keyof ReferenceAngles>;
      let score = 0; let weightSum = 0; let passWeight = 0; let nearPerfectWeight = 0;
      const diffs: Partial<Record<keyof ReferenceAngles, number>> = {};
      for (const key of keys) {
        const expected = reference[key];
        const actual = a[key];
        const diff = Math.abs(expected - actual);
        const tolerance = JOINT_TOLERANCE_DEG;
        const jointWeight = JOINT_WEIGHTS[key] ?? 0.1;
        weightSum += jointWeight;
        const jointScore = diff >= tolerance ? 0 : 1 - diff / tolerance;
        score += jointScore * jointWeight;
        diffs[key] = diff;
        if (diff <= tolerance * 0.5) passWeight += jointWeight; // comfortably correct
        if (diff <= tolerance * 0.25) nearPerfectWeight += jointWeight; // very precise
      }
      if (weightSum === 0) return { score: 0, passRatio: 0, nearPerfectRatio: 0 };
      return {
        score: (score / weightSum) * 100,
        passRatio: passWeight / weightSum,
        nearPerfectRatio: nearPerfectWeight / weightSum,
        diffs
      };
    };

    const resNormal = computeScore(false);
    const resMirrored = computeScore(true);
    let normalized = Math.max(resNormal.score, resMirrored.score);
    const passRatio = normalized === resNormal.score ? resNormal.passRatio : resMirrored.passRatio;
    const nearPerfectRatio = normalized === resNormal.score ? resNormal.nearPerfectRatio : resMirrored.nearPerfectRatio;
    lastJointDiffsRef.current = (normalized === resNormal.score ? resNormal.diffs : resMirrored.diffs) || null;
    // Visibility gating: if core joints are mostly invisible, reduce score
    // Visibility gating and penalty to avoid high scores from just face/hands
    const core = [
      LM.LEFT_SHOULDER, LM.RIGHT_SHOULDER,
      LM.LEFT_HIP, LM.RIGHT_HIP,
      LM.LEFT_ELBOW, LM.RIGHT_ELBOW,
      LM.LEFT_WRIST, LM.RIGHT_WRIST,
      LM.LEFT_KNEE, LM.RIGHT_KNEE,
      LM.LEFT_ANKLE, LM.RIGHT_ANKLE
    ];
    const visList = core.map(i => landmarks[i]?.visibility ?? 0);
    const visibleCount = visList.filter(v => v > 0.5).length;
    if (visibleCount < 6) return 0; // not enough body joints detected

    // Penalize proportionally when fewer joints are visible
    const visibilityFactor = Math.min(1, visibleCount / 12);
    normalized *= visibilityFactor;

    // Reward clear correctness: if most joints are well within tolerance, ensure 90%+
    if (passRatio >= 0.85) {
      normalized = Math.max(normalized, 90 + Math.min(5, (passRatio - 0.85) * 100));
    }
    // Near-perfect precision pushes towards 97–100
    if (nearPerfectRatio >= 0.6) {
      normalized = Math.max(normalized, 96 + Math.min(4, (nearPerfectRatio - 0.6) * 10));
    }

    return Math.max(0, Math.min(100, normalized));
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
