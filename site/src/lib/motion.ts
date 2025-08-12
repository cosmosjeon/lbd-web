export const Motion = {
  fadeUp: {
    hidden: { transform: "translateY(24px)", opacity: 0 },
    show: { transform: "translateY(0)", opacity: 1, transition: `all var(--duration-base) ease-out` },
  },
  scaleIn: {
    hidden: { transform: "scale(0.98)", opacity: 0 },
    show: { transform: "scale(1)", opacity: 1, transition: `all var(--duration-fast) ease-out` },
  },
};


