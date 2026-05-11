import React from 'react';

const AnimatedBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-slate-50">
      {/* SVG Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 800 560"
        >
          <style>
            {`
              @keyframes float1 {
                0% { transform: translate(0, 0) }
                50% { transform: translate(-10px, 0) }
                100% { transform: translate(0, 0) }
              }
              @keyframes float2 {
                0% { transform: translate(0, 0) }
                50% { transform: translate(-5px, -5px) }
                100% { transform: translate(0, 0) }
              }
              @keyframes float3 {
                0% { transform: translate(0, 0) }
                50% { transform: translate(0, -10px) }
                100% { transform: translate(0, 0) }
              }
              .triangle-float1 { animation: float1 5s infinite ease-in-out; }
              .triangle-float2 { animation: float2 4s infinite ease-in-out; }
              .triangle-float3 { animation: float3 6s infinite ease-in-out; }
            `}
          </style>
          <g fill="none">
            <path
              d="M461.96 520.89 a158.53 158.53 0 1 0 317.06 0 a158.53 158.53 0 1 0 -317.06 0z"
              fill="rgba(129, 28, 142, 0.15)"
              className="triangle-float2"
            />
            <path
              d="M593.06 179.84L455.43 109.72 385.31 247.34 522.93 317.46z"
              fill="rgba(129, 28, 142, 0.1)"
              className="triangle-float3"
            />
            <path
              d="M103.92 214.03 a100.17 100.17 0 1 0 200.34 0 a100.17 100.17 0 1 0 -200.34 0z"
              fill="rgba(129, 28, 142, 0.1)"
              className="triangle-float3"
            />
            <path
              d="M646.75 490.66L742.62 514.57 766.52 418.7 670.66 394.8z"
              fill="rgba(129, 28, 142, 0.12)"
              className="triangle-float2"
            />
            <path
              d="M597.58-7.75L562.06 101.59 671.4 137.12 706.93 27.77z"
              fill="rgba(129, 28, 142, 0.08)"
              className="triangle-float2"
            />
            <path
              d="M376.14 52.34L318.51 170.49 436.66 228.12 494.29 109.97z"
              fill="rgba(129, 28, 142, 0.1)"
              className="triangle-float2"
            />
          </g>
        </svg>
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;
