"use client";

import React, { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import Link from "next/link";
import CyberFormComponents from "../components/CyberForm";
import {
  TransactionProvider,
  useTransactionHandler,
} from "../components/TransactionStatus";
import WalletButton from "../components/WalletButton";
import TransactionConfirmationModal from "../components/TransactionConfirmationModal";
import { LoadingSpinner } from "../components/LoadingSpinner";

// Extract components from the default export
const {
  Form: CyberForm,
  Input: CyberInput,
  Submit: CyberSubmit,
  Section: CyberFormSection,
} = CyberFormComponents;

// NGO initialization form component
interface NgoInitFormProps {
  ngoAccountState: {
    exists: boolean;
    isNgoWallet: boolean;
  };
}

const NgoInitForm: React.FC<NgoInitFormProps> = ({ ngoAccountState }) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { handleTransaction } = useTransactionHandler();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoadingNgoData, setIsLoadingNgoData] = useState(false);

  // Fetch NGO data when the component mounts if the NGO exists
  useEffect(() => {
    const fetchNgoDetails = async () => {
      if (ngoAccountState.exists && wallet.publicKey) {
        try {
          setIsLoadingNgoData(true);
          // This is a placeholder - you'll need to implement a function to fetch the full NGO data
          console.log("Fetching NGO details for:", wallet.publicKey.toString());

          // For now, we'll just set some placeholder data
          // In a real implementation, you would fetch this from the blockchain
          setFormData({
            name: "Your NGO Name", // Replace with actual fetched data
          });
        } catch (error) {
          console.error("Error fetching NGO details:", error);
        } finally {
          setIsLoadingNgoData(false);
        }
      }
    };

    fetchNgoDetails();
  }, [ngoAccountState.exists, wallet.publicKey, connection]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

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

    if (!formData.name) {
      newErrors.name = "NGO name is required";
    } else if (formData.name.length > 20) {
      newErrors.name = "NGO name must be 20 characters or less";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const initializeNgo = async () => {
    try {
      if (!wallet.publicKey || !wallet.signTransaction) {
        throw new Error("Wallet not connected or doesn't support signing");
      }

      // Get parameters from the form
      const name = formData.name;

      console.log("Initializing NGO with:", {
        name,
        walletAddress: wallet.publicKey.toString(),
      });

      // This is a placeholder - you'll need to implement the actual NGO initialization
      // Simulate a transaction for now
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return "simulated-transaction-signature";
    } catch (error) {
      console.error("Error initializing NGO:", error);
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
        initializeNgo(),
        ngoAccountState.exists
          ? "Updating NGO account..."
          : "Initializing NGO account...",
        ngoAccountState.exists
          ? "NGO account updated successfully!"
          : "NGO account initialized successfully!",
        ngoAccountState.exists
          ? "Failed to update NGO account"
          : "Failed to initialize NGO account"
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
      label: "NGO Name",
      value: formData.name,
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

  const confirmationMessage = ngoAccountState.exists
    ? "Please review the updated NGO information before confirming."
    : "You are about to initialize an NGO account. This wallet will be linked to the NGO and will be able to apply for projects.";

  return (
    <div className="max-w-md mx-auto">
      <CyberForm onSubmit={handleSubmit}>
        <CyberFormSection
          title={ngoAccountState.exists ? "Edit NGO" : "NGO Registration"}
        >
          {ngoAccountState.exists ? (
            <p className="text-sm text-gray-400 mb-4">
              Update your NGO information below.
            </p>
          ) : (
            <div className="mb-6 border-l-4 border-cyber-neon p-4 bg-opacity-10 bg-cyber-neon">
              <h3 className="text-cyber-neon font-medium mb-2">
                NGO Registration
              </h3>
              <p className="text-sm text-gray-400 mb-2">
                <span className="text-cyber-pink font-medium">
                  No NGO account found.
                </span>{" "}
                Register your NGO to start applying for projects on the
                Milestone Protocol.
              </p>
              <p className="text-sm text-gray-400">
                As a registered NGO, you&apos;ll be able to:
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Apply for available projects</li>
                  <li>Submit project requirements</li>
                  <li>Receive funding for completed projects</li>
                </ul>
              </p>
            </div>
          )}

          {isLoadingNgoData ? (
            <div className="flex justify-center items-center p-4">
              <LoadingSpinner />
              <span className="ml-2">Loading NGO data...</span>
            </div>
          ) : (
            <>
              <CyberInput
                label="NGO Name"
                name="name"
                id="name"
                type="text"
                inputSize="md"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your NGO name (max 20 chars)"
                error={errors.name}
                required
                maxLength={20}
              />
            </>
          )}
        </CyberFormSection>

        {errors.submit && (
          <div className="text-cyber-pink text-sm mt-4">{errors.submit}</div>
        )}

        <CyberSubmit
          value={ngoAccountState.exists ? "Edit NGO" : "Register NGO"}
          isLoading={isLoading || isLoadingNgoData}
          disabled={isLoadingNgoData}
        />
      </CyberForm>

      {/* Transaction Confirmation Modal */}
      <TransactionConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmTransaction}
        title={
          ngoAccountState.exists
            ? "Confirm NGO Update"
            : "Confirm NGO Registration"
        }
        message={confirmationMessage}
        confirmButtonText={ngoAccountState.exists ? "Update" : "Register"}
        cancelButtonText="Cancel"
        details={confirmationDetails}
      />
    </div>
  );
};

// Check if an NGO account exists
const NgoCheck: React.FC<{
  onNgoStateChange: (exists: boolean, isNgoWallet: boolean) => void;
  onError?: (errorMessage: string) => void;
}> = ({ onNgoStateChange, onError }) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(true);
  const [ngoExists, setNgoExists] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkAttempted, setCheckAttempted] = useState(false);

  useEffect(() => {
    // Reset state when wallet changes
    if (publicKey) {
      if (!checkAttempted) {
        setLoading(true);
        setError(null);
      }
    } else {
      setLoading(false);
    }
  }, [publicKey, checkAttempted]);

  useEffect(() => {
    const checkNgo = async () => {
      if (!publicKey) {
        setLoading(false);
        return;
      }

      // Don't re-run if we've already checked
      if (checkAttempted) {
        return;
      }

      try {
        setLoading(true);
        console.log(
          "Starting NGO account check for wallet:",
          publicKey.toString()
        );

        // This is a placeholder - you'll need to implement the actual NGO account check
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // For demo purposes, let's assume NGO exists
        const exists = true;

        setNgoExists(exists);

        // Since this is the NGO's wallet checking its own NGO account,
        // if it exists, they have NGO privileges
        onNgoStateChange(exists, exists);
      } catch (err) {
        console.error("Error checking NGO account:", err);
        const errorMsg =
          "Failed to check NGO account: " +
          (err instanceof Error ? err.message : String(err));
        setError(errorMsg);
        if (onError) {
          onError(errorMsg);
        }
      } finally {
        setLoading(false);
        setCheckAttempted(true);
      }
    };

    // Only run this effect once per wallet
    let mounted = true;
    checkNgo().then(() => {
      if (!mounted) {
        console.log("Component unmounted during NGO check");
      }
    });

    return () => {
      mounted = false;
    };
  }, [connection, publicKey, onNgoStateChange, onError, checkAttempted]);

  // Add a button to retry the check if it failed
  const retryCheck = () => {
    setCheckAttempted(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoadingSpinner />
        <span className="ml-2">Checking NGO account...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p className="font-bold">Error</p>
        <p>{error}</p>
        <button
          onClick={retryCheck}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!publicKey) {
    return (
      <div className="cyber-card p-4 mb-6">
        <h2 className="text-xl text-cyber-neon font-bold mb-4">NGO Account</h2>
        <p className="text-gray-400">
          Please connect your wallet to check NGO status.
        </p>
      </div>
    );
  }

  return (
    <div className="cyber-card p-4 mb-6">
      <h2 className="text-xl text-cyber-neon font-bold mb-4">
        NGO Account Status
      </h2>

      {!ngoExists ? (
        <div className="mb-2 flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <span className="text-yellow-400 font-medium">
            No NGO account found for this wallet
          </span>
        </div>
      ) : (
        <div>
          <div className="mb-2 flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-green-400 font-medium">
              NGO account exists for this wallet
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Main NGO page component
const NgoPage = () => {
  const { connected } = useWallet();
  const [ngoAccountState, setNgoAccountState] = useState<{
    exists: boolean;
    isNgoWallet: boolean;
  }>({
    exists: false,
    isNgoWallet: false,
  });
  const [ngoCheckError, setNgoCheckError] = useState<string | null>(null);

  const handleNgoAccountState = (exists: boolean, isNgoWallet: boolean) => {
    setNgoAccountState({ exists, isNgoWallet });
  };

  const handleNgoCheckError = (errorMessage: string) => {
    console.error("NGO check error:", errorMessage);
    setNgoCheckError(errorMessage);
  };

  return (
    <TransactionProvider>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-cyber-neon mb-2">
              NGO Dashboard
            </h1>
            <p className="text-gray-400">
              {ngoAccountState.exists
                ? "Manage your NGO and apply for projects on the Milestone Protocol"
                : "Register your NGO and apply for projects on the Milestone Protocol"}
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
              Please connect your wallet to access the NGO dashboard
            </p>
          </div>
        ) : ngoCheckError ? (
          <div className="cyber-card p-8">
            <h2 className="text-xl text-cyber-pink mb-4">
              Error Checking NGO Account
            </h2>
            <p className="text-gray-400 mb-4">{ngoCheckError}</p>
            <button
              onClick={() => setNgoCheckError(null)}
              className="px-4 py-2 bg-cyber-purple text-white rounded hover:bg-cyber-pink transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {/* NGO Check Component */}
            <NgoCheck
              onNgoStateChange={handleNgoAccountState}
              onError={handleNgoCheckError}
            />

            {/* Only show NGO registration/edit form if not registered or if editing */}
            {(!ngoAccountState.exists || ngoAccountState.isNgoWallet) && (
              <div className="cyber-card p-6">
                <NgoInitForm ngoAccountState={ngoAccountState} />
              </div>
            )}

            {/* Only show NGO actions if the NGO exists */}
            {ngoAccountState.exists && (
              <div className="cyber-card p-6">
                <h2 className="text-xl text-cyber-neon mb-4">NGO Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="cyber-card-inner p-4">
                    <h3 className="text-lg text-cyber-purple mb-2">
                      Available Projects
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Browse and apply for available projects
                    </p>
                    <Link
                      href="/ngo/projects"
                      className="cyber-button-primary text-sm px-4 py-2 inline-block"
                    >
                      Browse Projects
                    </Link>
                  </div>

                  <div className="cyber-card-inner p-4">
                    <h3 className="text-lg text-cyber-purple mb-2">
                      My Applications
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      View your project applications and their status
                    </p>
                    <Link
                      href="/ngo/applications"
                      className="cyber-button-secondary text-sm px-4 py-2 inline-block"
                    >
                      View Applications
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </TransactionProvider>
  );
};

export default NgoPage;
