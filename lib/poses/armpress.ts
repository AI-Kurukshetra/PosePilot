export const armPressPose = {
  slug: "armpress",
  name: "Arm Press",
  image: "/poses/armpress.png",
  description:
    "Build compression through the core, lift tall through the shoulders, and stabilize the arms before pressing up.",
  angles: {
    arms: { min: 160, max: 180 },
    shoulders: { min: 80, max: 120 },
  },
  cues: [
    "Press firmly through the palms and keep the elbows extended without locking.",
    "Shift the shoulders slightly forward until the hips feel light.",
    "Draw the ribs inward so the lift comes from control, not momentum.",
  ],
  message: "Arm Press aligned.",
} as const;
