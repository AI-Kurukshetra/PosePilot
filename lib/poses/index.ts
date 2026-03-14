import { warriorPose } from "./warrior";
import { armPressPose } from "./armpress";
import { chairPose } from "./chair";

export type AngleRange = {
  min: number;
  max: number;
};

export type PoseDefinition = {
  slug: string;
  name: string;
  image: string;
  description: string;
  angles: Record<string, AngleRange>;
  cues: readonly string[];
  message: string;
};

export const poses = {
  warrior: warriorPose,
  armpress: armPressPose,
  chair: chairPose,
} satisfies Record<string, PoseDefinition>;

export type PoseKey = keyof typeof poses;
