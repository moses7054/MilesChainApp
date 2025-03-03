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

// Extract components from the default export
const {
  Form: CyberForm,
  Input: CyberInput,
  Submit: CyberSubmit,
  Section: CyberFormSection,
} = CyberFormComponents;

// Admin initialization form component
const AdminInitForm = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { handleTransaction } = useTransactionHandler();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    maxProjects: "100",
    feeBasisPoints: "50", // 0.5%
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

    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const initializeAdmin = async () => {
    try {
      if (!walletAdapter) {
        throw new Error("Wallet not connected");
      }

      // Get the max projects and fee basis points from the form
      const maxProjects = parseInt(formData.maxProjects);
      const feeBasisPoints = parseInt(formData.feeBasisPoints);

      // Set up the provider and program
      // @ts-ignore - The walletAdapter may not exactly match the expected type
      const provider = anchor.getProvider(walletAdapter as any, connection);
      const program = anchor.getMilestoneProgram(provider);

      // Initialize the admin account
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
      label: "Wallet",
      value: wallet.publicKey
        ? `${wallet.publicKey.toString().slice(0, 4)}...${wallet.publicKey
            .toString()
            .slice(-4)}`
        : "Not connected",
    },
  ];

  return (
    <div className="max-w-md mx-auto">
      <CyberForm onSubmit={handleSubmit}>
        <CyberFormSection title="Admin Initialization">
          <p className="text-sm text-gray-400 mb-4">
            Initialize the admin account by setting the maximum number of
            projects and the fee basis points (1 basis point = 0.01%).
          </p>

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

        <CyberSubmit value="Initialize Admin" isLoading={isLoading} />
      </CyberForm>

      {/* Transaction Confirmation Modal */}
      <TransactionConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmTransaction}
        title="Confirm Admin Initialization"
        message="Please review the admin initialization parameters before confirming."
        confirmButtonText="Initialize"
        cancelButtonText="Cancel"
        details={confirmationDetails}
      />
    </div>
  );
};

// Main admin page component
const AdminPage = () => {
  const { connected } = useWallet();

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

          <div className="mt-4 sm:mt-0">
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
            <AdminCheck />

            <div className="cyber-card p-6">
              <AdminInitForm />
            </div>

            <div className="cyber-card p-6">
              <h2 className="text-xl text-cyber-neon mb-4">Admin Actions</h2>
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
            </div>
          </div>
        )}
      </div>
    </TransactionProvider>
  );
};

export default AdminPage;
