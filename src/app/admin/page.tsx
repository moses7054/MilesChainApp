"use client";

import React, { useState, useMemo } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import Link from "next/link";
import CyberFormComponents from "../components/CyberForm";
import {
  TransactionProvider,
  useTransactionHandler,
} from "../components/TransactionStatus";
import WalletButton from "../components/WalletButton";
import * as anchor from "../utils/anchor";
import TransactionConfirmationModal from "../components/TransactionConfirmationModal";
import AdminCheck from "./components/AdminCheck";
import { PublicKey } from "@solana/web3.js";

// Extract components from the default export
const {
  Form: CyberForm,
  Input: CyberInput,
  Submit: CyberSubmit,
  Section: CyberFormSection,
} = CyberFormComponents;

// Admin initialization form component
interface AdminInitFormProps {
  adminAccountState: {
    exists: boolean;
    isAdminWallet: boolean;
  };
}

const AdminInitForm: React.FC<AdminInitFormProps> = ({ adminAccountState }) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { handleTransaction } = useTransactionHandler();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    maxProjects: "100",
    feeBasisPoints: "50", // 0.5%
    usdcMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // Default Solana USDC mint
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Create the adapter for the wallet
  const walletAdapter = useMemo(() => {
    if (!wallet.publicKey) return null;
    return {
      publicKey: wallet.publicKey,
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
    };
  }, [wallet.publicKey, wallet.signTransaction, wallet.signAllTransactions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Only allow numbers for numeric fields
    if (name !== "usdcMint" && !/^\d*$/.test(value)) return;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when input changes
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.maxProjects) {
      newErrors.maxProjects = "Maximum projects is required";
    } else if (parseInt(formData.maxProjects) <= 0) {
      newErrors.maxProjects = "Maximum projects must be greater than 0";
    } else if (parseInt(formData.maxProjects) > 10000) {
      newErrors.maxProjects = "Maximum projects must be less than 10,000";
    }

    if (!formData.feeBasisPoints) {
      newErrors.feeBasisPoints = "Fee basis points is required";
    } else if (parseInt(formData.feeBasisPoints) < 0) {
      newErrors.feeBasisPoints = "Fee basis points cannot be negative";
    } else if (parseInt(formData.feeBasisPoints) > 10000) {
      newErrors.feeBasisPoints = "Fee basis points cannot exceed 10,000 (100%)";
    }

    if (!formData.usdcMint) {
      newErrors.usdcMint = "USDC mint address is required";
    } else {
      try {
        // Just validate the public key is valid
        new PublicKey(formData.usdcMint);
      } catch {
        newErrors.usdcMint = "Invalid Solana public key";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const initializeAdmin = async () => {
    try {
      if (!walletAdapter) {
        throw new Error("Wallet not connected");
      }

      // Get parameters from the form
      const maxProjects = parseInt(formData.maxProjects);
      const feeBasisPoints = parseInt(formData.feeBasisPoints);
      // This address will be used in our anchor util function
      // We're validating it just for the UI
      // but not passing it as it's hardcoded in the anchor.ts file
      // new PublicKey(formData.usdcMint);

      // Set up the provider and program
      // @ts-expect-error - The walletAdapter may not exactly match the expected type
      const provider = anchor.getProvider(walletAdapter, connection);
      const program = anchor.getMilestoneProgram(provider);

      // Initialize the admin account with the connected wallet as the admin
      const txSignature = await anchor.initializeAdmin(
        program,
        maxProjects,
        feeBasisPoints
      );

      return txSignature;
    } catch (error) {
      console.error("Error initializing admin:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    if (!wallet.connected || !wallet.publicKey) {
      setErrors({ submit: "Please connect your wallet first" });
      return;
    }

    // Show confirmation modal instead of proceeding directly
    setShowConfirmation(true);
  };

  const handleConfirmTransaction = async () => {
    setIsLoading(true);

    try {
      // Call transaction handler
      await handleTransaction(
        initializeAdmin(),
        "Initializing admin account...",
        "Admin account initialized successfully!",
        "Failed to initialize admin account"
      );
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ submit: "Transaction failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare confirmation details
  const confirmationDetails = [
    {
      label: "Maximum Projects",
      value: formData.maxProjects,
    },
    {
      label: "Fee Basis Points",
      value: formData.feeBasisPoints,
    },
    {
      label: "Fee Percentage",
      value: `${(
        (parseInt(formData.feeBasisPoints || "0") / 10000) *
        100
      ).toFixed(2)}%`,
    },
    {
      label: "USDC Mint",
      value: `${formData.usdcMint.slice(0, 4)}...${formData.usdcMint.slice(
        -4
      )}`,
    },
    {
      label: "Admin Wallet",
      value: wallet.publicKey
        ? `${wallet.publicKey.toString().slice(0, 4)}...${wallet.publicKey
            .toString()
            .slice(-4)}`
        : "Not connected",
    },
  ];

  const confirmationMessage = adminAccountState.exists
    ? "Please review the updated admin parameters before confirming."
    : "You are about to initialize the admin account. This wallet will become the administrator of the Milestone Protocol with privileges to set fees and manage platform parameters. This action cannot be undone.";

  return (
    <div className="max-w-md mx-auto">
      <CyberForm onSubmit={handleSubmit}>
        <CyberFormSection title="Admin Initialization">
          {adminAccountState.exists ? (
            <p className="text-sm text-gray-400 mb-4">
              Update admin settings by modifying the values below. This will
              modify the existing admin account parameters.
            </p>
          ) : (
            <div className="mb-6 border-l-4 border-cyber-neon p-4 bg-opacity-10 bg-cyber-neon">
              <h3 className="text-cyber-neon font-medium mb-2">
                Administrator Account Creation
              </h3>
              <p className="text-sm text-gray-400 mb-2">
                <span className="text-cyber-pink font-medium">
                  No admin account found.
                </span>{" "}
                You are about to become the administrator of the Milestone
                Protocol.
              </p>
              <p className="text-sm text-gray-400">
                As admin, your wallet will have privileged access to:
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Receive platform fees from completed projects</li>
                  <li>Set global platform parameters</li>
                  <li>Manage projects and participants</li>
                </ul>
              </p>
            </div>
          )}

          <CyberInput
            label="Maximum Projects"
            name="maxProjects"
            id="maxProjects"
            type="text"
            inputSize="md"
            value={formData.maxProjects}
            onChange={handleChange}
            placeholder="Enter maximum projects (e.g., 100)"
            error={errors.maxProjects}
            required
          />

          <CyberInput
            label="Fee Basis Points"
            name="feeBasisPoints"
            id="feeBasisPoints"
            type="text"
            inputSize="md"
            value={formData.feeBasisPoints}
            onChange={handleChange}
            placeholder="Enter fee basis points (e.g., 50 = 0.5%)"
            error={errors.feeBasisPoints}
            required
          />

          <CyberInput
            label="USDC Mint Address"
            name="usdcMint"
            id="usdcMint"
            type="text"
            inputSize="md"
            value={formData.usdcMint}
            onChange={handleChange}
            placeholder="Enter USDC mint address"
            error={errors.usdcMint}
            required
          />

          <div className="mt-2 text-xs text-cyber-neon">
            <p>
              Fee:{" "}
              {(
                (parseInt(formData.feeBasisPoints || "0") / 10000) *
                100
              ).toFixed(2)}
              %
            </p>
          </div>
        </CyberFormSection>

        {errors.submit && (
          <div className="text-cyber-pink text-sm mt-4">{errors.submit}</div>
        )}

        <CyberSubmit
          value={
            adminAccountState.exists
              ? "Update Admin Settings"
              : "Initialize Admin Account"
          }
          isLoading={isLoading}
        />
      </CyberForm>

      {/* Transaction Confirmation Modal */}
      <TransactionConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmTransaction}
        title={
          adminAccountState.exists
            ? "Confirm Admin Update"
            : "Confirm Admin Initialization"
        }
        message={confirmationMessage}
        confirmButtonText={adminAccountState.exists ? "Update" : "Initialize"}
        cancelButtonText="Cancel"
        details={confirmationDetails}
      />
    </div>
  );
};

// Main admin page component
const AdminPage = () => {
  const { connected } = useWallet();
  const [adminAccountState, setAdminAccountState] = useState<{
    exists: boolean;
    isAdminWallet: boolean;
  }>({
    exists: false,
    isAdminWallet: false,
  });

  const handleAdminAccountState = (exists: boolean, isAdminWallet: boolean) => {
    setAdminAccountState({ exists, isAdminWallet });
  };

  // Determine if we should show the admin form
  // Show it if either:
  // 1. Admin account doesn't exist (so someone can create it)
  // 2. Admin account exists AND connected wallet has admin privileges
  const showAdminInitForm =
    !adminAccountState.exists ||
    (adminAccountState.exists && adminAccountState.isAdminWallet);

  return (
    <TransactionProvider>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-cyber-neon mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-400">
              Initialize and manage the Milestone Protocol
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <Link
              href="/"
              className="cyber-button-secondary text-sm px-4 py-2 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Switch Roles
            </Link>
            <WalletButton />
          </div>
        </div>

        {!connected ? (
          <div className="cyber-card p-8 text-center">
            <p className="text-xl text-cyber-pink mb-4">Wallet Not Connected</p>
            <p className="text-gray-400 mb-6">
              Please connect your wallet to access the admin dashboard
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {/* Admin Check Component */}
            <AdminCheck onAdminStateChange={handleAdminAccountState} />

            {showAdminInitForm && (
              <div className="cyber-card p-6">
                <AdminInitForm adminAccountState={adminAccountState} />
              </div>
            )}

            <div className="cyber-card p-6">
              <h2 className="text-xl text-cyber-neon mb-4">Admin Actions</h2>
              {adminAccountState.isAdminWallet ? (
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/admin/stats"
                      className="text-cyber-purple hover:text-cyber-pink transition-colors"
                    >
                      View Statistics
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/projects"
                      className="text-cyber-purple hover:text-cyber-pink transition-colors"
                    >
                      Manage Projects
                    </Link>
                  </li>
                </ul>
              ) : (
                <p className="text-gray-400">
                  Connect with an admin wallet to access admin actions.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </TransactionProvider>
  );
};

export default AdminPage;
