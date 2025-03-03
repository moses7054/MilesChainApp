"use client";

import React, { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { TransactionProvider } from "../../components/TransactionStatus";
import WalletButton from "../../components/WalletButton";
import { LoadingSpinner } from "../../components/LoadingSpinner";

interface AdminStats {
  maxProjects: number;
  feeBasisPoints: number;
  totalProjects: number;
  totalNGOs: number;
  totalCompanies: number;
  totalFees: number;
}

// Mock function to fetch admin stats
const fetchAdminStats = async (): Promise<AdminStats> => {
  // This would normally fetch data from the blockchain
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        maxProjects: 100,
        feeBasisPoints: 50, // 0.5%
        totalProjects: 12,
        totalNGOs: 8,
        totalCompanies: 5,
        totalFees: 0.75, // SOL
      });
    }, 1500);
  });
};

// Stats card component
const StatCard: React.FC<{
  title: string;
  value: string | number;
  description?: string;
}> = ({ title, value, description }) => (
  <div className="cyber-card p-4">
    <h3 className="text-cyber-neon text-lg font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-white mb-2">{value}</p>
    {description && <p className="text-xs text-gray-400">{description}</p>}
  </div>
);

// Admin stats component
const AdminStatsDisplay = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!wallet.connected) {
      setIsLoading(false);
      return;
    }

    const loadStats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const adminStats = await fetchAdminStats();
        setStats(adminStats);
      } catch (err) {
        console.error("Error fetching admin stats:", err);
        setError("Failed to load admin statistics. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [wallet.connected, connection]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <LoadingSpinner
          size="lg"
          variant="glow"
          message="Loading admin statistics..."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="cyber-card p-6 text-center">
        <p className="text-cyber-pink mb-4">{error}</p>
        <button
          className="cyber-button px-4 py-2"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="cyber-card p-6 text-center">
        <p className="text-white mb-4">No stats available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard
        title="Maximum Projects"
        value={stats.maxProjects}
        description="Maximum allowed projects in the protocol"
      />
      <StatCard
        title="Fee Rate"
        value={`${(stats.feeBasisPoints / 100).toFixed(2)}%`}
        description="Current fee rate for transactions"
      />
      <StatCard
        title="Total Projects"
        value={stats.totalProjects}
        description="Total number of registered projects"
      />
      <StatCard
        title="NGO Participants"
        value={stats.totalNGOs}
        description="Total number of registered NGOs"
      />
      <StatCard
        title="Company Participants"
        value={stats.totalCompanies}
        description="Total number of registered companies"
      />
      <StatCard
        title="Total Fees Collected"
        value={`${stats.totalFees} SOL`}
        description="Total fees collected from transactions"
      />
    </div>
  );
};

// Stats page
const AdminStatsPage = () => {
  const { connected } = useWallet();

  return (
    <TransactionProvider>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-cyber-neon mb-2">
              Admin Statistics
            </h1>
            <p className="text-gray-400">
              Overview of the Milestone Protocol performance
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <Link
              href="/admin"
              className="text-cyber-purple hover:text-cyber-pink transition-colors"
            >
              Back to Dashboard
            </Link>
            <WalletButton />
          </div>
        </div>

        {!connected ? (
          <div className="cyber-card p-8 text-center">
            <p className="text-xl text-cyber-pink mb-4">Wallet Not Connected</p>
            <p className="text-gray-400 mb-6">
              Please connect your wallet to view admin statistics
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="cyber-card p-6">
              <h2 className="text-xl text-cyber-neon mb-6">
                Protocol Statistics
              </h2>
              <AdminStatsDisplay />
            </div>

            <div className="cyber-card p-6">
              <h2 className="text-xl text-cyber-neon mb-4">
                Activity Timeline
              </h2>
              <p className="text-gray-400">
                This feature will display a timeline of recent protocol
                activity.
              </p>
            </div>
          </div>
        )}
      </div>
    </TransactionProvider>
  );
};

export default AdminStatsPage;
