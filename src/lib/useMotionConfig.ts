import { useReducedMotion, type Transition } from "framer-motion";

export function useAppMotion() {
  const shouldReduceMotion = useReducedMotion();

  const transition: Transition = shouldReduceMotion
    ? { duration: 0.1 }
    : { type: "spring", damping: 25, stiffness: 200 };

  return {
    shouldReduceMotion,
    transition,
    fadeVariant: {
      initial: { opacity: 0, y: shouldReduceMotion ? 0 : 8 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: shouldReduceMotion ? 0 : -8 },
    },
    collapseVariant: {
      initial: { opacity: 0, height: 0 },
      animate: { opacity: 1, height: "auto" },
      exit: { opacity: 0, height: 0 },
    },
  };
}
