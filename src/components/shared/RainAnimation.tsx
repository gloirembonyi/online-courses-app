"use client";

import React, { useEffect, useRef } from "react";

export function RainAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Reduce the number of raindrops and update frequency for better performance
    const RAINDROP_COUNT = 50; // Reduced from 100
    const UPDATE_INTERVAL = 100; // Increased from 50ms to 100ms

    const createRaindrop = () => {
      const raindrop = document.createElement("div");
      raindrop.className = "raindrop";
      raindrop.style.left = `${Math.random() * 100}%`;
      raindrop.style.animationDelay = `${Math.random() * 2}s`;
      raindrop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
      raindrop.style.opacity = `${0.1 + Math.random() * 0.4}`;
      return raindrop;
    };

    // Create initial raindrops
    const raindrops = Array.from({ length: RAINDROP_COUNT }, createRaindrop);
    raindrops.forEach((drop) => container.appendChild(drop));

    // Continuously add new raindrops at a reduced rate
    const interval = setInterval(() => {
      // Only add new drops if the container has fewer than the maximum
      if (container.children.length < RAINDROP_COUNT) {
        const newDrop = createRaindrop();
        container.appendChild(newDrop);

        // Remove the drop after animation
        setTimeout(() => {
          if (container.contains(newDrop)) {
            newDrop.remove();
          }
        }, 2000);
      }
    }, UPDATE_INTERVAL);

    return () => {
      clearInterval(interval);
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);

  return <div ref={containerRef} className="rain-container" />;
}
