export type Segment = [number, number];

export type RegionFeedback = {
  id: string;
  label: string;
  detail: string;
  isCorrect: boolean;
  segments: Segment[];
};

export type PoseEvaluationSnapshot = {
  score: number;
  isCorrect: boolean;
  detail: string;
  regions: RegionFeedback[];
};
