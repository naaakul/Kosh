"use client";
import React from "react";
import { useEffect, useRef } from "react";
import Image from "next/image";

const bg = () => {
  const pathRef = useRef<SVGPathElement>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    if (pathRef.current) {
      const pathLength = pathRef.current.getTotalLength();
      
      // Set initial styles
      pathRef.current.style.strokeDasharray = `${pathLength}px`;
      pathRef.current.style.strokeDashoffset = `${pathLength}px`;
      
      // Create and inject keyframes with the actual path length
      const keyframes = `
        @keyframes drawLine {
          0% {
            stroke-dashoffset: ${pathLength};
          }
          50% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: ${pathLength};
          }
        }
      `;
      
      if (styleRef.current) {
        styleRef.current.innerHTML = keyframes;
      } else {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = keyframes;
        document.head.appendChild(styleElement);
        styleRef.current = styleElement;
      }
    }
    
    // Cleanup function
    return () => {
      if (styleRef.current) {
        styleRef.current.remove();
        styleRef.current = null;
      }
    };
  }, []);
  return (
    <Image
      src={"bg.svg"}
      alt="bg"
      height={2000}
      width={2000}
      className="w-full pointer-events-none absolute z-10 opacity-5"
    ></Image>
  );
};

export default bg;
