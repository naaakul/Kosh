"use client";
import React from "react";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";

const Bg = () => {
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
        const styleElement = document.createElement("style");
        styleElement.innerHTML = keyframes;
        document.head.appendChild(styleElement);
        styleRef.current = styleElement;
      }

      // Apply the animation to the path
      pathRef.current.style.animation = "drawLine 20s ease-in-out infinite alternate";
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
    <motion.svg
      initial={{ y: -5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="size-[1550px] -top-64 pointer-events-none absolute z-10"
      width="1280"
      height="830"
      viewBox="0 0 1280 830"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        ref={pathRef}
        d="M288 -71C234.834 -98.5 140.9 -108.5 190.5 71.5C252.5 296.5 189 58.5 277 58.5C365 58.5 524.5 150.5 549 111C573.5 71.5 355.5 41 522.5 37.5C689.5 34 496 -0.5 522.5 13C549 26.5 663.5 64.7828 564 58.5C464.5 52.2172 697 146.5 774 122C851 97.5 933 126 980 184C1027 242 1161.5 206.5 1137 122C1112.5 37.5 1069 66 999.5 80.5C930 95 965.5 92 1015.5 101.5C1065.5 111 1181 146.5 1080.5 138.5C980 130.5 950.5 -45.5 842.5 13C734.5 71.5 671.5 154 774 169C876.5 184 1175.5 161.5 1167.5 324.5C1159.5 487.5 1068.5 507 1059 424.5C1049.5 342 1161 352.5 1222.5 407C1284 461.5 1338.5 494 1209.5 450.5C1080.5 407 1264.5 166.5 1209.5 324.5C1154.5 482.5 926 644 1059 620C1192 596 881.5 467 385.5 407C-110.5 347 83.5002 405 246.5 474.5C409.5 544 87.0001 38 127 196.5C167 355 209.5 590.5 127 558.5C44.5001 526.5 40.9999 492.5 159 513.5C277 534.5 -24.9999 534 30.0001 558.5C85.0001 583 57.0001 598 146 609C235 620 224 650.5 127 705.5C30.0001 760.5 -43.9999 820 57.5001 823.5C159 827 77.9998 720.5 321 609C564 497.5 518.5 618.5 432.5 662C346.5 705.5 653.5 497 807 571.5C960.5 646 1157.5 747 1175.5 678C1193.5 609 1251.5 741.5 1209.5 777C1167.5 812.5 817.5 743 830 694.5C842.5 646 26.4997 763.5 136.5 809C246.5 854.5 2.50018 533 30.0001 436C57.5001 339 12.5001 274.5 57.5001 184C102.5 93.5 133 22 81.5 22C30.0001 22 -7 13 -109 13"
        stroke="#0D2789"
        stroke-opacity="0.05"
        stroke-width="12"
      />
    </motion.svg>
  );
};

export default Bg;
