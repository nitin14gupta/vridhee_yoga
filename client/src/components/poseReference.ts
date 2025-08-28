// Reference pose definitions and weights for scoring

export type ReferenceAngles = {
  // angles in degrees for key joints
  leftElbow: number;
  rightElbow: number;
  leftShoulder: number;
  rightShoulder: number;
  leftHip: number;
  rightHip: number;
  leftKnee: number;
  rightKnee: number;
  torsoTilt: number; // angle of line connecting mid-shoulders to mid-hips vs horizontal
};

// MediaPipe Pose landmark indices
export const LM = {
  NOSE: 0,
  LEFT_EYE_INNER: 1,
  LEFT_EYE: 2,
  LEFT_EYE_OUTER: 3,
  RIGHT_EYE_INNER: 4,
  RIGHT_EYE: 5,
  RIGHT_EYE_OUTER: 6,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  LEFT_MOUTH: 9,
  RIGHT_MOUTH: 10,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_PINKY: 17,
  RIGHT_PINKY: 18,
  LEFT_INDEX: 19,
  RIGHT_INDEX: 20,
  LEFT_THUMB: 21,
  RIGHT_THUMB: 22,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32
} as const;

export const UPWARD_DOG_REFERENCE: ReferenceAngles = {
  leftElbow: 175,
  rightElbow: 175,
  leftShoulder: 70,
  rightShoulder: 70,
  leftHip: 180,
  rightHip: 180,
  leftKnee: 180,
  rightKnee: 180,
  torsoTilt: 15
};

// Weights grouped by focus areas as requested: chest, hands, legs
export const JOINT_WEIGHTS: Record<keyof ReferenceAngles, number> = {
  // chest (shoulders + torso)
  leftShoulder: 0.14,
  rightShoulder: 0.14,
  torsoTilt: 0.12,
  // hands (elbows)
  leftElbow: 0.15,
  rightElbow: 0.15,
  // legs (hips + knees)
  leftHip: 0.10,
  rightHip: 0.10,
  leftKnee: 0.05,
  rightKnee: 0.05
};

// Per-joint tolerance in degrees for a full score (beyond this, score scales down)
export const JOINT_TOLERANCE_DEG = 20;


