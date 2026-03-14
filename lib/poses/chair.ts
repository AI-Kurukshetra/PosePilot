export const chairPose = {
  slug: "chair",
  name: "Chair Reach",
  image: "/poses/chair.png",
  description:
    "Sit tall with arms spread horizontally, chest lifted and shoulders tracking backward for a mindful desk-ready pose.",
  angles: {
    arms: { min: 150, max: 210 },
    torso: { min: 0, max: 12 }, // allowed horizontal drift in percentage of frame width
  },
  cues: [
    "Keep both elbows level with the shoulders and palms facing downward.",
    "Draw the shoulder blades toward each other while keeping the chest lifted.",
    "Sit with hips rooted, spine tall, and chin neutral.",
  ],
  message: "Upper torso aligned.",
} as const;
