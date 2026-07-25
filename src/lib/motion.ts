// Motion Design Tokens for Shop Kareta

// Fast, snappy interactions (Buttons, Toggles, Dropdowns)
export const premiumSpring = { 
  type: "spring" as const, 
  stiffness: 400, 
  damping: 30 
};

// Smooth, fluid layout shifts (Drawers, Modals, Accordions)
export const fluidLayout = { 
  type: "spring" as const, 
  stiffness: 100, 
  damping: 20 
};

// Elegant page entrances (Text fades, image reveals)
export const elegantEase = { 
  duration: 0.6, 
  ease: [0.22, 1, 0.36, 1] as const
};

// Stagger children for lists
export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Fade up motion variant
export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: elegantEase },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

// Slide up variant
export const slideUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: elegantEase },
  exit: { opacity: 0, y: -30, transition: { duration: 0.2 } }
};

// Stagger container
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Magnetic spring for tactile buttons
export const magneticSpring = {
  type: "spring" as const,
  stiffness: 150,
  damping: 15,
  mass: 0.1
};

// Scale up variant
export const scaleUp = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: elegantEase },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};
