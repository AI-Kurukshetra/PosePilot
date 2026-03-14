"use client";

import type { PoseEvaluationSnapshot, RegionFeedback, Segment } from "@/lib/pose-feedback";
import { poses, type PoseKey } from "@/lib/poses";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Landmark = {
  x: number;
  y: number;
};

type PoseResults = {
  image: CanvasImageSource;
  poseLandmarks?: Landmark[];
};

type MediaPipePoseInstance = {
  close: () => Promise<void>;
  onResults: (callback: (results: PoseResults) => void) => void;
  send: (input: { image: HTMLVideoElement | null }) => Promise<void>;
  setOptions: (options: {
    selfieMode: boolean;
    modelComplexity: 0 | 1 | 2;
    smoothLandmarks: boolean;
    minDetectionConfidence: number;
    minTrackingConfidence: number;
  }) => void;
};

type DrawLandmarks = (
  context: CanvasRenderingContext2D,
  landmarks: Landmark[],
  options?: { color?: string; lineWidth?: number; radius?: number }
) => void;

declare global {
  interface Window {
    Pose?: new (config?: { locateFile: (file: string) => string }) => MediaPipePoseInstance;
    POSE_CONNECTIONS?: Segment[];
    drawLandmarks?: DrawLandmarks;
  }
}

const scriptLoaders = new Map<string, Promise<void>>();

function loadScript(src: string) {
  const existingLoader = scriptLoaders.get(src);

  if (existingLoader) {
    return existingLoader;
  }

  const loader = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${src}"]`);

    if (existingScript) {
      if (existingScript.getAttribute("data-loaded") === "true") {
        resolve();
        return;
      }

      const handleLoad = () => {
        existingScript.setAttribute("data-loaded", "true");
        resolve();
      };

      const handleError = () => {
        scriptLoaders.delete(src);
        reject(new Error(`Failed to load script: ${src}`));
      };

      existingScript.addEventListener("load", handleLoad, { once: true });
      existingScript.addEventListener("error", handleError, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.setAttribute("data-loaded", "true");
      resolve();
    };
    script.onerror = () => {
      scriptLoaders.delete(src);
      reject(new Error(`Failed to load script: ${src}`));
    };
    document.body.appendChild(script);
  });

  scriptLoaders.set(src, loader);

  return loader;
}

function calculateAngle(a: Landmark, b: Landmark, c: Landmark) {
  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);

  let angle = Math.abs((radians * 180) / Math.PI);

  if (angle > 180) {
    angle = 360 - angle;
  }

  return angle;
}

function createRegionFeedback(
  id: string,
  label: string,
  isCorrect: boolean,
  detail: string,
  segments: Segment[]
): RegionFeedback {
  return { id, label, isCorrect, detail, segments };
}

function resolvePoseState(poseKey: PoseKey, landmarks: Landmark[]): PoseEvaluationSnapshot {
  if (poseKey === "warrior") {
    const frontKneeAngle = calculateAngle(landmarks[24], landmarks[26], landmarks[28]);
    const backLegAngle = calculateAngle(landmarks[23], landmarks[25], landmarks[27]);
    const { frontKnee, backLeg } = poses.warrior.angles;

    const frontKneeCorrect =
      frontKneeAngle >= frontKnee.min && frontKneeAngle <= frontKnee.max;
    const backLegCorrect = backLegAngle >= backLeg.min && backLegAngle <= backLeg.max;

    const regions = [
      createRegionFeedback(
        "front-knee",
        "Front knee",
        frontKneeCorrect,
        frontKneeCorrect
          ? `Front knee stable at ${Math.round(frontKneeAngle)} deg.`
          : `Bring the front knee into the ${frontKnee.min}-${frontKnee.max} deg range.`,
        [
          [24, 26],
          [26, 28],
        ]
      ),
      createRegionFeedback(
        "back-leg",
        "Back leg",
        backLegCorrect,
        backLegCorrect
          ? `Back leg extended at ${Math.round(backLegAngle)} deg.`
          : `Lengthen the back leg toward the ${backLeg.min}-${backLeg.max} deg range.`,
        [
          [23, 25],
          [25, 27],
        ]
      ),
    ];

    const score = Math.round(
      (regions.filter((region) => region.isCorrect).length / regions.length) * 100
    );
    const firstIncorrect = regions.find((region) => !region.isCorrect);

    return {
      score,
      isCorrect: regions.every((region) => region.isCorrect),
      detail: firstIncorrect
        ? firstIncorrect.detail
        : "Warrior pose is aligned. Hold steady.",
      regions,
    };
  }

  if (poseKey === "chair") {
    const leftArmAngle = calculateAngle(landmarks[11], landmarks[13], landmarks[15]);
    const rightArmAngle = calculateAngle(landmarks[12], landmarks[14], landmarks[16]);
    const shoulderCenterX = (landmarks[11].x + landmarks[12].x) / 2;
    const hipCenterX = (landmarks[23].x + landmarks[24].x) / 2;
    const torsoDrift = Math.abs(shoulderCenterX - hipCenterX);
    const { arms, torso } = poses.chair.angles;

    const leftArmCorrect = leftArmAngle >= arms.min && leftArmAngle <= arms.max;
    const rightArmCorrect = rightArmAngle >= arms.min && rightArmAngle <= arms.max;
    const torsoCorrect = torsoDrift <= torso.max / 100; // convert allowed drift from pose definition

    const regions = [
      createRegionFeedback(
        "left-arm",
        "Left arm",
        leftArmCorrect,
        leftArmCorrect
          ? `Left arm level at ${Math.round(leftArmAngle)} deg.`
          : `Lift the left arm toward the ${arms.min}-${arms.max} deg range.`,
        [
          [11, 13],
          [13, 15],
        ]
      ),
      createRegionFeedback(
        "right-arm",
        "Right arm",
        rightArmCorrect,
        rightArmCorrect
          ? `Right arm level at ${Math.round(rightArmAngle)} deg.`
          : `Extend the right arm until it reaches the ${arms.min}-${arms.max} deg range.`,
        [
          [12, 14],
          [14, 16],
        ]
      ),
      createRegionFeedback(
        "torso",
        "Torso stack",
        torsoCorrect,
        torsoCorrect
          ? "Upper torso centered over the hips."
          : `Keep shoulders stacked over hips; drift is ${Math.round(torsoDrift * 100)}%.`,
        [
          [23, 11],
          [11, 12],
          [12, 24],
        ]
      ),
    ];

    const score = Math.round(
      (regions.filter((region) => region.isCorrect).length / regions.length) * 100
    );
    const firstIncorrect = regions.find((region) => !region.isCorrect);

    return {
      score,
      isCorrect: regions.every((region) => region.isCorrect),
      detail: firstIncorrect
        ? firstIncorrect.detail
        : "Upper torso is aligned. Maintain the calm reach.",
      regions,
    };
  }

  const leftArmAngle = calculateAngle(landmarks[11], landmarks[13], landmarks[15]);
  const rightArmAngle = calculateAngle(landmarks[12], landmarks[14], landmarks[16]);
  const leftShoulderAngle = calculateAngle(landmarks[23], landmarks[11], landmarks[13]);
  const rightShoulderAngle = calculateAngle(landmarks[24], landmarks[12], landmarks[14]);
  const averageShoulderAngle = (leftShoulderAngle + rightShoulderAngle) / 2;
  const { arms, shoulders } = poses.armpress.angles;

  const leftArmCorrect = leftArmAngle >= arms.min && leftArmAngle <= arms.max;
  const rightArmCorrect = rightArmAngle >= arms.min && rightArmAngle <= arms.max;
  const shoulderStackCorrect =
    averageShoulderAngle >= shoulders.min && averageShoulderAngle <= shoulders.max;

  const regions = [
    createRegionFeedback(
      "left-arm",
      "Left arm",
      leftArmCorrect,
      leftArmCorrect
        ? `Left arm stacked at ${Math.round(leftArmAngle)} deg.`
        : `Press through the left arm until it reaches the ${arms.min}-${arms.max} deg range.`,
      [
        [11, 13],
        [13, 15],
      ]
    ),
    createRegionFeedback(
      "right-arm",
      "Right arm",
      rightArmCorrect,
      rightArmCorrect
        ? `Right arm stacked at ${Math.round(rightArmAngle)} deg.`
        : `Press through the right arm until it reaches the ${arms.min}-${arms.max} deg range.`,
      [
        [12, 14],
        [14, 16],
      ]
    ),
    createRegionFeedback(
      "shoulders",
      "Shoulder stack",
      shoulderStackCorrect,
      shoulderStackCorrect
        ? `Shoulders are loaded at ${Math.round(averageShoulderAngle)} deg.`
        : `Shift the shoulders into the ${shoulders.min}-${shoulders.max} deg range.`,
      [
        [23, 11],
        [11, 13],
        [24, 12],
        [12, 14],
      ]
    ),
  ];

  const score = Math.round(
    (regions.filter((region) => region.isCorrect).length / regions.length) * 100
  );
  const firstIncorrect = regions.find((region) => !region.isCorrect);

  return {
    score,
    isCorrect: regions.every((region) => region.isCorrect),
    detail: firstIncorrect ? firstIncorrect.detail : "Arm press is aligned. Hold steady.",
    regions,
  };
}

function drawSegment(
  context: CanvasRenderingContext2D,
  landmarks: Landmark[],
  [startIndex, endIndex]: Segment,
  color: string,
  lineWidth: number
) {
  const start = landmarks[startIndex];
  const end = landmarks[endIndex];

  if (!start || !end) {
    return;
  }

  context.beginPath();
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.stroke();
}

function drawOverlay(
  context: CanvasRenderingContext2D,
  landmarks: Landmark[],
  highlightedRegions: RegionFeedback[]
) {
  const width = context.canvas.width;
  const height = context.canvas.height;
  const normalizedLandmarks = landmarks.map((landmark) => ({
    x: landmark.x * width,
    y: landmark.y * height,
  }));

  if (window.POSE_CONNECTIONS) {
    for (const segment of window.POSE_CONNECTIONS) {
      drawSegment(context, normalizedLandmarks, segment, "rgba(255, 255, 255, 0.18)", 2);
    }
  }

  for (const region of highlightedRegions) {
    const color = region.isCorrect ? "#00E676" : "#FF4C4C";

    for (const segment of region.segments) {
      drawSegment(context, normalizedLandmarks, segment, color, 7);
    }
  }

  window.drawLandmarks?.(context, normalizedLandmarks, {
    color: "#F5F5F5",
    lineWidth: 1,
    radius: 3,
  });
}

export default function PoseDetector({
  poseType,
  onFeedbackChange,
  onStateChange,
}: {
  poseType: PoseKey;
  onFeedbackChange?: (regions: RegionFeedback[]) => void;
  onStateChange?: (state: PoseEvaluationSnapshot) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameIdRef = useRef<number>(0);
  const [alignmentScore, setAlignmentScore] = useState(0);
  const [statusLabel, setStatusLabel] = useState("Awaiting posture");
  const [statusTone, setStatusTone] = useState<"correct" | "incorrect">("incorrect");
  const [detail, setDetail] = useState("Camera feed initializing");

  useEffect(() => {
    let isActive = true;
    let poseInstance: MediaPipePoseInstance | null = null;
    let isStopping = false;

    const stopSession = () => {
      if (isStopping) {
        return;
      }

      isStopping = true;
      isActive = false;

      if (frameIdRef.current) {
        window.cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = 0;
      }

      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      }

      if (poseInstance) {
        const activeInstance = poseInstance;
        poseInstance = null;
        void activeInstance.close().catch(() => {
          // Ignore close failures during teardown so navigation is never blocked.
        });
      }
    };

    const syncCanvasDimensions = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas || !video.videoWidth || !video.videoHeight) {
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    };

    async function start() {
      try {
        await Promise.all([
          loadScript("/vendor/mediapipe/drawing_utils/drawing_utils.js"),
          loadScript("/vendor/mediapipe/pose/pose.js"),
        ]);

        if (!window.Pose || !window.drawLandmarks) {
          throw new Error("Pose detection libraries are unavailable.");
        }

        const createdPose = new window.Pose({
          locateFile: (file: string) => `/vendor/mediapipe/pose/${file}`,
        });
        poseInstance = createdPose;

        createdPose.setOptions({
          selfieMode: true,
          modelComplexity: 1 as 0 | 1 | 2,
          smoothLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        const activePose = createdPose;

        activePose.onResults((results: PoseResults) => {
          if (!isActive) {
            return;
          }

          const context = canvasRef.current?.getContext("2d");

          if (!context || !canvasRef.current) {
            return;
          }

          context.save();
          context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          context.translate(canvasRef.current.width, 0);
          context.scale(-1, 1);
          context.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

          if (results.poseLandmarks) {
            const state = resolvePoseState(poseType, results.poseLandmarks);
            const hasIncorrectRegion = state.regions.some((region) => !region.isCorrect);

            setAlignmentScore(state.score);
            setStatusLabel(state.isCorrect ? "Posture locked" : "Live corrections");
            setStatusTone(hasIncorrectRegion ? "incorrect" : "correct");
            setDetail(state.detail);
            onFeedbackChange?.(state.regions);
            onStateChange?.(state);

            drawOverlay(context, results.poseLandmarks, state.regions);
          }

          context.restore();
        });

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: "user",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });
        streamRef.current = stream;

        if (videoRef.current && isActive) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          syncCanvasDimensions();
        }

        const detect = async () => {
          if (!isActive) {
            return;
          }

          if (videoRef.current) {
            syncCanvasDimensions();

            try {
              await activePose.send({ image: videoRef.current });
            } catch (error) {
              if (isActive) {
                const message =
                  error instanceof Error
                    ? error.message
                    : "Pose detection stopped unexpectedly.";
                setStatusLabel("Session unavailable");
                setDetail(message);
                stopSession();
              }
              return;
            }
          }

          frameIdRef.current = window.requestAnimationFrame(detect);
        };

        frameIdRef.current = window.requestAnimationFrame(detect);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to start the camera feed.";
        setStatusLabel("Session unavailable");
        setDetail(message);
      }
    }

    void start();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        stopSession();
      }
    };

    const handlePageHide = () => {
      stopSession();
    };

    const handleLiveSessionExit = () => {
      stopSession();
    };

    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("posepilot:leave-live-session", handleLiveSessionExit);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("posepilot:leave-live-session", handleLiveSessionExit);
      stopSession();
    };
  }, [onFeedbackChange, onStateChange, poseType]);

  return (
    <div className="relative h-full min-h-[calc(100vh-11rem)] w-full overflow-hidden rounded-[28px] border border-white/10 bg-black">
      <video ref={videoRef} className="hidden" muted playsInline />

      <canvas
        ref={canvasRef}
        width={1280}
        height={960}
        className="h-full w-full object-cover"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
      {[
        "left-3 top-3 border-l border-t sm:left-5 sm:top-5",
        "right-3 top-3 border-r border-t sm:right-5 sm:top-5",
        "bottom-3 left-3 border-b border-l sm:bottom-5 sm:left-5",
        "bottom-3 right-3 border-b border-r sm:bottom-5 sm:right-5",
      ].map((position) => (
        <div
          key={position}
          className={`pointer-events-none absolute h-6 w-6 border-[#D4AF37]/35 ${position}`}
        />
      ))}

      <div className="absolute left-3 right-3 top-3 flex flex-col gap-3 sm:left-5 sm:right-5 sm:top-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="rounded-3xl border border-white/10 bg-black/45 px-4 py-3 backdrop-blur-md">
          <p className="text-[11px] uppercase tracking-[0.32em] text-white/42">Alignment</p>
          <p className="mt-2 text-3xl text-[#F5F5F5]">{alignmentScore}%</p>
        </div>

        <motion.div
          animate={{ scale: statusTone === "correct" ? [1, 1.02, 1] : [1, 1.01, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className={`max-w-md rounded-3xl border px-4 py-3 backdrop-blur-md ${
            statusTone === "correct"
              ? "border-[#00E676]/30 bg-[#00E676]/12"
              : "border-[#FF4C4C]/30 bg-[#FF4C4C]/12"
          }`}
        >
          <p
            className={`text-[11px] uppercase tracking-[0.32em] ${
              statusTone === "correct" ? "text-[#00E676]" : "text-[#FF4C4C]"
            }`}
          >
            {statusLabel}
          </p>
          <p className="mt-2 text-sm leading-6 text-white/76">{detail}</p>
        </motion.div>
      </div>
    </div>
  );
}
