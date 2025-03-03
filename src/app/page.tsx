"use client";

import WalletButton from "./components/WalletButton";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoadingSpinner } from "./components/LoadingSpinner";

export default function Home() {
  const router = useRouter();
  const [loadingPortal, setLoadingPortal] = useState<string | null>(null);

  const navigateWithLoading = (path: string, portalName: string) => {
    setLoadingPortal(portalName);
    router.push(path);
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Hexagon Grid Background */}
      <div className="fixed inset-0 z-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern
            id="hexagons"
            width="50"
            height="43.4"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M25 0l25 43.3h-50z"
              className="stroke-cyber-pink"
              fill="none"
              strokeWidth="0.8"
            />
            <path
              d="M25 0l25 43.3h-50z"
              className="stroke-cyber-purple"
              fill="none"
              strokeWidth="0.8"
              transform="translate(0, 43.4) scale(1, -1)"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
      </div>

      {/* Animated Circuit Lines */}
      <div className="fixed inset-0 z-0 opacity-40 svg-container">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 100 Q 200 150, 400 100 T 800 100"
            className="stroke-cyber-pink animate-pulse-slow svg-path"
            fill="none"
            strokeWidth="1"
          />
          <path
            d="M0 200 Q 200 250, 400 200 T 800 200"
            className="stroke-cyber-purple animate-pulse-slow svg-path"
            fill="none"
            strokeWidth="1"
          />
          <path
            d="M0 300 Q 200 350, 400 300 T 800 300"
            className="stroke-cyber-magenta animate-pulse-slow svg-path"
            fill="none"
            strokeWidth="1"
          />
          <path
            d="M0 400 Q 200 450, 400 400 T 800 400"
            className="stroke-cyber-pink animate-pulse-slow svg-path"
            fill="none"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Header with Wallet Button - Fixed position */}
      <header className="fixed top-0 left-0 z-30 p-0 w-full">
        <div className="flex justify-end pr-0 sm:pr-0.5 md:pr-1 lg:pt-3">
          <WalletButton />
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center px-2 sm:px-4 md:px-6 lg:px-8 max-w-4xl mx-auto pt-8 sm:pt-12 md:pt-16 lg:pt-0">
          <div className="mb-6 sm:mb-8 animate-[float_4s_ease-in-out_infinite]">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-cyber mb-3 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyber-pink to-cyber-purple leading-tight">
              Milestone
              <wbr />
              Chain
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mt-2 sm:mt-4 px-2">
              Funding Made Ease
            </p>
          </div>

          <div className="cyber-card backdrop-blur-lg bg-opacity-20 p-3 sm:p-4 md:p-6 lg:p-8 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            <p className="text-sm sm:text-base md:text-lg text-gray-300">
              Secure • Transparent • Decentralized
            </p>
          </div>

          {/* Portal Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mt-6 sm:mt-8 md:mt-10 lg:mt-12">
            <div className="cyber-card hover:scale-105 transition-transform p-3 sm:p-4 md:p-5">
              <h3 className="text-base sm:text-lg md:text-xl mb-2 sm:mb-3 md:mb-4 text-cyber-pink">
                Admin Portal
              </h3>
              <button
                onClick={() => navigateWithLoading("/admin", "admin")}
                className="cyber-button w-full text-xs sm:text-sm md:text-base py-1 sm:py-2 md:py-3 px-2 sm:px-3 md:px-4"
                disabled={loadingPortal !== null}
              >
                {loadingPortal === "admin" ? (
                  <span className="flex items-center justify-center">
                    <LoadingSpinner
                      size="sm"
                      variant="pulse"
                      className="mr-2"
                    />
                    Loading...
                  </span>
                ) : (
                  "Enter →"
                )}
              </button>
            </div>
            <div className="cyber-card hover:scale-105 transition-transform p-3 sm:p-4 md:p-5">
              <h3 className="text-base sm:text-lg md:text-xl mb-2 sm:mb-3 md:mb-4 text-cyber-pink">
                NGO Portal
              </h3>
              <button
                onClick={() => navigateWithLoading("/ngo", "ngo")}
                className="cyber-button w-full text-xs sm:text-sm md:text-base py-1 sm:py-2 md:py-3 px-2 sm:px-3 md:px-4"
                disabled={loadingPortal !== null}
              >
                {loadingPortal === "ngo" ? (
                  <span className="flex items-center justify-center">
                    <LoadingSpinner
                      size="sm"
                      variant="pulse"
                      className="mr-2"
                    />
                    Loading...
                  </span>
                ) : (
                  "Enter →"
                )}
              </button>
            </div>
            <div className="cyber-card hover:scale-105 transition-transform p-3 sm:p-4 md:p-5">
              <h3 className="text-base sm:text-lg md:text-xl mb-2 sm:mb-3 md:mb-4 text-cyber-pink">
                Company Portal
              </h3>
              <button
                onClick={() => navigateWithLoading("/company", "company")}
                className="cyber-button w-full text-xs sm:text-sm md:text-base py-1 sm:py-2 md:py-3 px-2 sm:px-3 md:px-4"
                disabled={loadingPortal !== null}
              >
                {loadingPortal === "company" ? (
                  <span className="flex items-center justify-center">
                    <LoadingSpinner
                      size="sm"
                      variant="pulse"
                      className="mr-2"
                    />
                    Loading...
                  </span>
                ) : (
                  "Enter →"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
