"use client";

import { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShouldAnimate(false);
    }

    const listener = (e: MediaQueryListEvent) => {
      setShouldAnimate(!e.matches);
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  if (!shouldAnimate) {
    return <>{children}</>;
  }

  return (
    <ReactLenis 
      root 
      options={{ 
        lerp: 0.1, 
        duration: 1.2, 
        smoothWheel: true 
      }}
    >
      {children}
    </ReactLenis>
  );
}
