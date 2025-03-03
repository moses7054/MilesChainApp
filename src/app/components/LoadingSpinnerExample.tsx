"use client";

import React, { useState } from "react";
import { LoadingSpinner, MatrixSpinner, HackerSpinner } from "./LoadingSpinner";

export const LoadingSpinnerExample: React.FC = () => {
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [spinnerType, setSpinnerType] = useState<
    "default" | "matrix" | "hacker"
  >("default");
  const [size, setSize] = useState<"sm" | "md" | "lg" | "xl">("md");
  const [variant, setVariant] = useState<"default" | "glow" | "pulse">(
    "default"
  );

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 cyber-card">
      <h2 className="text-cyber-neon text-2xl font-bold mb-8">
        Loading Spinner Examples
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="p-5 cyber-card flex flex-col items-center justify-center">
          <h3 className="text-cyber-neon mb-4">Default Spinner</h3>
          <LoadingSpinner size="md" variant={variant} message="Loading..." />
        </div>

        <div className="p-5 cyber-card flex flex-col items-center justify-center">
          <h3 className="text-cyber-neon mb-4">Matrix Spinner</h3>
          <MatrixSpinner size="md" message="Loading..." />
        </div>

        <div className="p-5 cyber-card flex flex-col items-center justify-center">
          <h3 className="text-cyber-neon mb-4">Hacker Spinner</h3>
          <HackerSpinner size="md" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="cyber-card p-4">
          <h3 className="text-cyber-neon mb-4">Customize Spinner</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-cyber-neon mb-2">Spinner Type</label>
              <select
                className="cyber-input w-full"
                value={spinnerType}
                onChange={(e) =>
                  setSpinnerType(
                    e.target.value as "default" | "matrix" | "hacker"
                  )
                }
              >
                <option value="default">Default</option>
                <option value="matrix">Matrix</option>
                <option value="hacker">Hacker</option>
              </select>
            </div>

            <div>
              <label className="block text-cyber-neon mb-2">Size</label>
              <select
                className="cyber-input w-full"
                value={size}
                onChange={(e) =>
                  setSize(e.target.value as "sm" | "md" | "lg" | "xl")
                }
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">Extra Large</option>
              </select>
            </div>

            {spinnerType === "default" && (
              <div>
                <label className="block text-cyber-neon mb-2">Variant</label>
                <select
                  className="cyber-input w-full"
                  value={variant}
                  onChange={(e) =>
                    setVariant(e.target.value as "default" | "glow" | "pulse")
                  }
                >
                  <option value="default">Default</option>
                  <option value="glow">Glow</option>
                  <option value="pulse">Pulse</option>
                </select>
              </div>
            )}
          </div>

          <button
            className="cyber-button w-full mt-6"
            onClick={() => setShowFullscreen(true)}
          >
            Show Fullscreen
          </button>
        </div>

        <div className="cyber-card p-4 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-cyber-neon mb-4">Preview</h3>

            {spinnerType === "default" && (
              <LoadingSpinner
                size={size}
                variant={variant}
                message="Loading..."
              />
            )}

            {spinnerType === "matrix" && (
              <MatrixSpinner size={size} message="Loading..." />
            )}

            {spinnerType === "hacker" && <HackerSpinner size={size} />}
          </div>
        </div>
      </div>

      {showFullscreen && (
        <>
          {spinnerType === "default" && (
            <LoadingSpinner
              size={size}
              variant={variant}
              fullScreen
              message="Loading your data..."
            />
          )}

          {spinnerType === "matrix" && (
            <MatrixSpinner size={size} fullScreen message="Processing..." />
          )}

          {spinnerType === "hacker" && <HackerSpinner size={size} fullScreen />}

          <div className="fixed bottom-6 right-6 z-50">
            <button
              className="cyber-button"
              onClick={() => setShowFullscreen(false)}
            >
              Close Fullscreen
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LoadingSpinnerExample;
