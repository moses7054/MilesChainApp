import React, { useState, useEffect } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { checkAdminAccount, fetchAdminData } from "../utils/adminAccount";
import { LoadingSpinner } from "../../components/LoadingSpinner";

// Create a proper type for admin data
interface AdminData {
  adminPDA: PublicKey;
  adminSignerPubkey: PublicKey;
  maxProjects: number;
  feeBasisPoints: number;
  adminBump: number;
  adminAta: PublicKey;
}

const AdminCheck: React.FC = () => {
  const { connection } = useConnection();
  const [loading, setLoading] = useState(true);
  const [adminExists, setAdminExists] = useState(false);
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        setLoading(true);
        const result = await checkAdminAccount(connection);
        setAdminExists(result.adminExists);

        if (result.adminExists) {
          const data = await fetchAdminData(connection);
          setAdminData(data);
        }
      } catch (err) {
        console.error("Error checking admin account:", err);
        setError("Failed to check admin account");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [connection]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoadingSpinner />
        <span className="ml-2">Checking admin account...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="cyber-card p-4 mb-6">
      <h2 className="text-xl text-cyber-neon font-bold mb-4">
        Admin Account Check
      </h2>

      {adminExists ? (
        <div>
          <div className="mb-2 flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-green-400 font-medium">
              Admin account exists on the network
            </span>
          </div>

          {adminData && (
            <div className="mt-4 border-t border-gray-700 pt-4">
              <h3 className="text-lg text-cyber-neon mb-2">
                Admin Account Details
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-400">Admin PDA:</div>
                <div className="text-white break-all">
                  {adminData.adminPDA.toString()}
                </div>

                <div className="text-gray-400">Admin Signer:</div>
                <div className="text-white break-all">
                  {adminData.adminSignerPubkey.toString()}
                </div>

                <div className="text-gray-400">Max Projects:</div>
                <div className="text-white">{adminData.maxProjects}</div>

                <div className="text-gray-400">Fee (basis points):</div>
                <div className="text-white">
                  {adminData.feeBasisPoints} (
                  {(adminData.feeBasisPoints / 100).toFixed(2)}%)
                </div>

                <div className="text-gray-400">Admin ATA:</div>
                <div className="text-white break-all">
                  {adminData.adminAta.toString()}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-2 flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <span className="text-red-400 font-medium">
            Admin account does not exist on the network
          </span>
          <p className="mt-2 text-gray-400 text-sm">
            An admin account needs to be initialized before the platform can be
            used.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminCheck;
