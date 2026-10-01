import { FilesetResolver, HandLandmarker, HandLandmarkerResult } from '@mediapipe/tasks-vision';

let handLandmarkerInstance: HandLandmarker | null = null;
let isLoadingInstance = false;
let initError: Error | null = null;

export async function getHandLandmarker(): Promise<HandLandmarker> {
  if (handLandmarkerInstance) return handLandmarkerInstance;
  if (isLoadingInstance) {
    // Wait for in-progress initialization
    for (let i = 0; i < 50; i++) {
      await new Promise(r => setTimeout(r, 100));
      if (handLandmarkerInstance) return handLandmarkerInstance;
    }
  }

  isLoadingInstance = true;
  try {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    );

    handLandmarkerInstance = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
        delegate: 'GPU'
      },
      runningMode: 'VIDEO',
      numHands: 2,
      minHandDetectionConfidence: 0.5,
      minHandPresenceConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    isLoadingInstance = false;
    return handLandmarkerInstance;
  } catch (err: any) {
    isLoadingInstance = false;
    initError = err;
    console.warn('MediaPipe HandLandmarker initialization issue, falling back:', err);
    throw err;
  }
}

export type DetectedHand = {
  handedness: 'Left' | 'Right';
  score: number;
  landmarks: Array<{ x: number; y: number; z: number }>;
};

export interface ProcessedHandGesture {
  hands: DetectedHand[];
  primaryHand: DetectedHand | null;
  activeGesture: 'Point' | 'Pinch' | 'Open Palm' | 'Fist' | 'Two-Hand Zoom' | 'None';
  indexTip: { x: number; y: number; z: number } | null;
  thumbTip: { x: number; y: number; z: number } | null;
  pinchDistance: number;
  isPinching: boolean;
  isPointing: boolean;
  twoHandDistance?: number;
}

export function analyzeHandLandmarks(result: HandLandmarkerResult): ProcessedHandGesture {
  const hands: DetectedHand[] = [];

  if (result.landmarks && result.landmarks.length > 0) {
    for (let i = 0; i < result.landmarks.length; i++) {
      const lms = result.landmarks[i];
      let handedness: 'Left' | 'Right' = 'Right';
      let score = 0.9;

      if (result.handedness && result.handedness[i] && result.handedness[i][0]) {
        handedness = result.handedness[i][0].categoryName === 'Left' ? 'Left' : 'Right';
        score = result.handedness[i][0].score;
      }

      hands.push({
        handedness,
        score,
        landmarks: lms
      });
    }
  }

  if (hands.length === 0) {
    return {
      hands: [],
      primaryHand: null,
      activeGesture: 'None',
      indexTip: null,
      thumbTip: null,
      pinchDistance: 1.0,
      isPinching: false,
      isPointing: false
    };
  }

  // Primary hand is the first detected or right hand
  const primary = hands[0];
  const lms = primary.landmarks;

  const wrist = lms[0];
  const thumbTip = lms[4];
  const indexMcp = lms[5];
  const indexTip = lms[8];
  const middleTip = lms[12];
  const ringTip = lms[16];
  const pinkyTip = lms[20];

  // Pinch distance in normalized coordinates
  const pinchDx = indexTip.x - thumbTip.x;
  const pinchDy = indexTip.y - thumbTip.y;
  const pinchDz = (indexTip.z || 0) - (thumbTip.z || 0);
  const pinchDistance = Math.sqrt(pinchDx * pinchDx + pinchDy * pinchDy + pinchDz * pinchDz);

  const isPinching = pinchDistance < 0.08;

  // Check if index finger is extended while other fingers are curled
  const isIndexExtended = indexTip.y < indexMcp.y - 0.08;
  const isMiddleCurled = middleTip.y > lms[9].y - 0.04;
  const isRingCurled = ringTip.y > lms[13].y - 0.04;
  const isPinkyCurled = pinkyTip.y > lms[17].y - 0.04;

  const isPointing = isIndexExtended && (isMiddleCurled || isRingCurled);

  let activeGesture: ProcessedHandGesture['activeGesture'] = 'Open Palm';

  if (hands.length >= 2) {
    const hand1Center = hands[0].landmarks[0];
    const hand2Center = hands[1].landmarks[0];
    const twoHandDist = Math.hypot(hand1Center.x - hand2Center.x, hand1Center.y - hand2Center.y);
    activeGesture = 'Two-Hand Zoom';
    return {
      hands,
      primaryHand: primary,
      activeGesture,
      indexTip,
      thumbTip,
      pinchDistance,
      isPinching,
      isPointing,
      twoHandDistance: twoHandDist
    };
  }

  if (isPinching) {
    activeGesture = 'Pinch';
  } else if (isPointing) {
    activeGesture = 'Point';
  } else if (isMiddleCurled && isRingCurled && isPinkyCurled && !isIndexExtended) {
    activeGesture = 'Fist';
  } else {
    activeGesture = 'Open Palm';
  }

  return {
    hands,
    primaryHand: primary,
    activeGesture,
    indexTip,
    thumbTip,
    pinchDistance,
    isPinching,
    isPointing
  };
}

// Landmark connection indices for rendering 21 hand joints
export const HAND_CONNECTIONS = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle
  [0, 9], [9, 10], [10, 11], [11, 12],
  // Ring
  [0, 13], [13, 14], [14, 15], [15, 16],
  // Pinky
  [0, 17], [17, 18], [18, 19], [19, 20],
  // Palm knuckles
  [5, 9], [9, 13], [13, 17]
];
