export default function Home() {
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

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen pt-0">
        <div className="text-center px-4 sm:px-6 md:px-8 max-w-4xl mx-auto">
          <div className="mb-8 animate-[float_4s_ease-in-out_infinite]">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-cyber mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyber-pink to-cyber-purple">
              MilestoneChain
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mt-4">
              Revolutionizing Project Funding Through Blockchain
            </p>
          </div>

          <div className="cyber-card backdrop-blur-lg bg-opacity-20 p-6 md:p-8 mb-12">
            <p className="text-lg text-gray-300">
              Secure • Transparent • Decentralized
            </p>
          </div>

          {/* Portal Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="cyber-card hover:scale-105 transition-transform">
              <h3 className="text-xl mb-4 text-cyber-pink">Admin Portal</h3>
              <button className="cyber-button w-full">Enter →</button>
            </div>
            <div className="cyber-card hover:scale-105 transition-transform">
              <h3 className="text-xl mb-4 text-cyber-pink">NGO Portal</h3>
              <button className="cyber-button w-full">Enter →</button>
            </div>
            <div className="cyber-card hover:scale-105 transition-transform">
              <h3 className="text-xl mb-4 text-cyber-pink">Company Portal</h3>
              <button className="cyber-button w-full">Enter →</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
