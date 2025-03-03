"use client";

import React from "react";

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "glow" | "pulse";
  fullScreen?: boolean;
  message?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  variant = "default",
  fullScreen = false,
  message,
  className = "",
}) => {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const colors = {
    default:
      "border-t-cyber-purple border-r-cyber-neon border-b-cyber-pink border-l-cyber-magenta",
    glow: "border-t-cyber-purple border-r-cyber-neon border-b-cyber-pink border-l-cyber-magenta shadow-neon",
    pulse: "border-cyber-purple animate-pulse shadow-neon",
  };

  const spinner = (
    <div className={`relative ${sizes[size]} ${className}`}>
      <div
        className={`absolute inset-0 rounded-full border-[3px] ${colors[variant]} animate-spin`}
      ></div>
      {variant === "glow" && (
        <div className="absolute inset-0 rounded-full border-2 border-cyber-purple opacity-70 animate-ping"></div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cyber-black bg-opacity-80 backdrop-blur-sm">
        {spinner}
        {message && (
          <p className="mt-4 text-cyber-neon text-lg font-medium max-w-xs text-center">
            {message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {spinner}
      {message && <p className="mt-2 text-cyber-neon text-sm">{message}</p>}
    </div>
  );
};

// Additional spinner variations

export const MatrixSpinner: React.FC<Omit<LoadingSpinnerProps, "variant">> = ({
  size = "md",
  fullScreen = false,
  message,
  className = "",
}) => {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const gridSize = {
    sm: "grid-cols-3 gap-1",
    md: "grid-cols-3 gap-1.5",
    lg: "grid-cols-3 gap-2",
    xl: "grid-cols-3 gap-3",
  };

  const dotSize = {
    sm: "w-1 h-1",
    md: "w-2 h-2",
    lg: "w-3 h-3",
    xl: "w-4 h-4",
  };

  const spinner = (
    <div className={`grid ${gridSize[size]} ${sizes[size]} ${className}`}>
      {[...Array(9)].map((_, i) => (
        <div
          key={i}
          className={`${dotSize[size]} rounded-full bg-cyber-purple animate-pulse`}
          style={{
            animationDelay: `${(i * 0.1).toFixed(1)}s`,
            opacity: 0.3 + (i % 3) * 0.2,
          }}
        ></div>
      ))}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cyber-black bg-opacity-80 backdrop-blur-sm">
        {spinner}
        {message && (
          <p className="mt-4 text-cyber-neon text-lg font-medium max-w-xs text-center">
            {message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {spinner}
      {message && <p className="mt-2 text-cyber-neon text-sm">{message}</p>}
    </div>
  );
};

export const HackerSpinner: React.FC<
  Omit<LoadingSpinnerProps, "variant" | "message">
> = ({ size = "md", fullScreen = false, className = "" }) => {
  const sizes = {
    sm: "text-xs",
    md: "text-base",
    lg: "text-xl",
    xl: "text-2xl",
  };

  const wrapperSizes = {
    sm: "w-24",
    md: "w-40",
    lg: "w-60",
    xl: "w-80",
  };

  const characters = "10".split("");
  const [text, setText] = React.useState("");

  React.useEffect(() => {
    let frame = 0;
    let length = 0;
    let direction = 1;

    const interval = setInterval(() => {
      frame++;

      if (frame % 3 === 0) {
        // Grow or shrink the text
        length += direction;

        if (length >= 30) direction = -1;
        if (length <= 5) direction = 1;

        // Generate random binary
        let newText = "";
        for (let i = 0; i < length; i++) {
          newText += characters[Math.floor(Math.random() * characters.length)];
        }
        setText(newText);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const spinner = (
    <div
      className={`font-mono ${sizes[size]} text-cyber-neon ${wrapperSizes[size]} text-center overflow-hidden ${className}`}
    >
      <div className="animate-typing whitespace-nowrap">{text}</div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cyber-black bg-opacity-80 backdrop-blur-sm">
        {spinner}
        <p className="mt-4 text-cyber-neon text-lg font-medium">LOADING...</p>
      </div>
    );
  }

  return spinner;
};

export default {
  LoadingSpinner,
  MatrixSpinner,
  HackerSpinner,
};
