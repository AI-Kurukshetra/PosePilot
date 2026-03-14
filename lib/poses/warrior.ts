export const warriorPose = {
  slug: "warrior",
  name: "Warrior Pose",
  image: "/poses/warrior.png",
  description:
    "Open the chest, settle the shoulders, and maintain a grounded front knee for a balanced warrior line.",
  angles: {
    frontKnee: { min: 80, max: 110 },
    backLeg: { min: 160, max: 180 },
  },
  cues: [
    "Stack the front knee above the ankle without letting it drift inward.",
    "Lengthen through the back leg and keep the rear heel pressing away.",
    "Stay wide across the collarbones while the arms reach evenly in both directions.",
  ],
  message: "Warrior position aligned.",
} as const;
