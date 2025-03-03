"use client";

import React, { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import WalletButton from "../../components/WalletButton";
import TransactionConfirmationModal from "../../components/TransactionConfirmationModal";
import {
  TransactionProvider,
  useTransactionHandler,
} from "../../components/TransactionStatus";

// Placeholder application data type
interface Application {
  id: string;
  projectId: string;
  projectName: string;
  companyName: string;
  status: "Processing" | "Accepted" | "Rejected";
  requirementsHash: string;
  submittedAt: string;
  amount: number;
}

// NGO check component - simplified version that just checks if NGO exists
const NgoCheck: React.FC<{
  onNgoStateChange: (exists: boolean) => void;
  onError?: (errorMessage: string) => void;
}> = ({ onNgoStateChange, onError }) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(true);
  const [ngoExists, setNgoExists] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkNgo = async () => {
      if (!publicKey) {
        setLoading(false);
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
        onNgoStateChange(exists);
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
      }
    };

    checkNgo();
  }, [connection, publicKey, onNgoStateChange, onError]);

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

  if (!ngoExists) {
    return (
      <div className="cyber-card p-4 mb-6">
        <h2 className="text-xl text-cyber-pink font-bold mb-4">
          No NGO Account Found
        </h2>
        <p className="text-gray-400 mb-4">
          You need to register an NGO before you can view applications.
        </p>
        <Link
          href="/ngo"
          className="cyber-button-primary text-sm px-4 py-2 inline-block"
        >
          Register NGO
        </Link>
      </div>
    );
  }

  return null; // If NGO exists, don't show anything
};

// Application detail component
const ApplicationDetail: React.FC<{
  application: Application;
  onClose: () => void;
}> = ({ application, onClose }) => {
  const wallet = useWallet();
  const { handleTransaction } = useTransactionHandler();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [action, setAction] = useState<"edit" | "withdraw" | null>(null);
  const [formData, setFormData] = useState({
    requirementsHash: application.requirementsHash,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

    if (!formData.requirementsHash) {
      newErrors.requirementsHash = "Requirements hash is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const performAction = async () => {
    try {
      if (!wallet.publicKey || !wallet.signTransaction) {
        throw new Error("Wallet not connected or doesn't support signing");
      }

      if (action === "edit") {
        console.log("Editing application with:", {
          applicationId: application.id,
          requirementsHash: formData.requirementsHash,
          walletAddress: wallet.publicKey.toString(),
        });
      } else if (action === "withdraw") {
        console.log("Withdrawing application:", {
          applicationId: application.id,
          walletAddress: wallet.publicKey.toString(),
        });
      }

      // This is a placeholder - you'll need to implement the actual action
      // Simulate a transaction for now
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return "simulated-transaction-signature";
    } catch (error) {
      console.error(
        `Error ${action === "edit" ? "editing" : "withdrawing"} application:`,
        error
      );
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (action === "edit" && !validate()) return;

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
        performAction(),
        action === "edit"
          ? "Updating application..."
          : "Withdrawing application...",
        action === "edit"
          ? "Application updated successfully!"
          : "Application withdrawn successfully!",
        action === "edit"
          ? "Failed to update application"
          : "Failed to withdraw application"
      );
      onClose(); // Close the detail view after successful action
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
      label: "Project Name",
      value: application.projectName,
    },
    {
      label: "Company",
      value: application.companyName,
    },
    ...(action === "edit"
      ? [
          {
            label: "Requirements Hash",
            value: formData.requirementsHash,
          },
        ]
      : []),
    {
      label: "Wallet",
      value: wallet.publicKey
        ? `${wallet.publicKey.toString().slice(0, 4)}...${wallet.publicKey
            .toString()
            .slice(-4)}`
        : "Not connected",
    },
  ];

  const confirmationMessage =
    action === "edit"
      ? "You are about to update your application requirements. This will require a transaction to be signed."
      : "You are about to withdraw your application. This will require a transaction to be signed.";

  const getStatusColor = (status: Application["status"]) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-900 text-yellow-300";
      case "Accepted":
        return "bg-green-900 text-green-300";
      case "Rejected":
        return "bg-red-900 text-red-300";
      default:
        return "bg-gray-800 text-gray-300";
    }
  };

  return (
    <div className="cyber-card-inner p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl text-cyber-neon font-bold">
          Application Details
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-cyber-pink"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="mb-6">
        <h4 className="text-lg text-cyber-purple mb-2">
          {application.projectName}
        </h4>
        <p className="text-sm text-gray-400 mb-2">
          Company: {application.companyName}
        </p>
        <p className="text-sm text-gray-400 mb-2">
          Amount: {application.amount} USDC
        </p>
        <div className="flex items-center mb-2">
          <span className="text-xs text-gray-400 mr-2">Status:</span>
          <span
            className={`text-xs px-2 py-0.5 rounded ${getStatusColor(
              application.status
            )}`}
          >
            {application.status}
          </span>
        </div>
        <p className="text-sm text-gray-400">
          Submitted: {new Date(application.submittedAt).toLocaleDateString()}
        </p>
      </div>

      {action === "edit" ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="requirementsHash"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Requirements Hash
            </label>
            <textarea
              id="requirementsHash"
              name="requirementsHash"
              rows={3}
              className={`w-full px-3 py-2 bg-gray-800 border ${
                errors.requirementsHash
                  ? "border-cyber-pink"
                  : "border-gray-700"
              } rounded-md text-white focus:outline-none focus:ring-1 focus:ring-cyber-purple`}
              placeholder="Enter your requirements hash (32 bytes)"
              value={formData.requirementsHash}
              onChange={handleChange}
            ></textarea>
            {errors.requirementsHash && (
              <p className="mt-1 text-sm text-cyber-pink">
                {errors.requirementsHash}
              </p>
            )}
          </div>

          {errors.submit && (
            <div className="text-cyber-pink text-sm mt-4">{errors.submit}</div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setAction(null)}
              className="mr-2 px-4 py-2 border border-gray-600 text-gray-300 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyber-purple text-white rounded hover:bg-cyber-pink transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Updating...</span>
                </span>
              ) : (
                "Update"
              )}
            </button>
          </div>
        </form>
      ) : action === "withdraw" ? (
        <div>
          <p className="text-gray-400 mb-4">
            Are you sure you want to withdraw this application? This action
            cannot be undone.
          </p>
          <div className="flex justify-end">
            <button
              onClick={() => setAction(null)}
              className="mr-2 px-4 py-2 border border-gray-600 text-gray-300 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Withdrawing...</span>
                </span>
              ) : (
                "Withdraw Application"
              )}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-300 mb-1">
              Requirements Hash
            </h5>
            <div className="p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-300 break-all">
              {application.requirementsHash}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            {application.status === "Processing" && (
              <>
                <button
                  onClick={() => setAction("edit")}
                  className="px-4 py-2 bg-cyber-purple text-white rounded hover:bg-cyber-pink transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setAction("withdraw")}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Withdraw
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Transaction Confirmation Modal */}
      <TransactionConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmTransaction}
        title={
          action === "edit"
            ? "Confirm Application Update"
            : "Confirm Application Withdrawal"
        }
        message={confirmationMessage}
        confirmButtonText={action === "edit" ? "Update" : "Withdraw"}
        cancelButtonText="Cancel"
        details={confirmationDetails}
      />
    </div>
  );
};

// Application list component
const ApplicationList: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);

  useEffect(() => {
    // Simulate fetching applications
    const fetchApplications = async () => {
      try {
        setLoading(true);
        // This is a placeholder - you'll need to implement the actual application fetching logic

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data for now
        const mockApplications: Application[] = [
          {
            id: "app-1",
            projectId: "project-1",
            projectName: "Sustainable Energy Initiative",
            companyName: "EcoTech Solutions",
            status: "Processing",
            requirementsHash:
              "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
            submittedAt: "2023-03-01T12:00:00Z",
            amount: 1000,
          },
          {
            id: "app-2",
            projectId: "project-2",
            projectName: "Clean Water Access Program",
            companyName: "Global Health Partners",
            status: "Accepted",
            requirementsHash:
              "0x9876543210abcdef9876543210abcdef9876543210abcdef9876543210abcdef",
            submittedAt: "2023-02-15T09:30:00Z",
            amount: 750,
          },
          {
            id: "app-3",
            projectId: "project-3",
            projectName: "Education Technology for Rural Areas",
            companyName: "Future Learning Inc.",
            status: "Rejected",
            requirementsHash:
              "0x1122334455667788990011223344556677889900112233445566778899001122",
            submittedAt: "2023-01-20T15:45:00Z",
            amount: 1200,
          },
        ];

        setApplications(mockApplications);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoadingSpinner />
        <span className="ml-2">Loading your applications...</span>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="cyber-card-inner p-8 text-center">
        <p className="text-xl text-cyber-pink mb-4">No Applications Found</p>
        <p className="text-gray-400 mb-6">
          You haven&apos;t applied for any projects yet.
        </p>
        <Link
          href="/ngo/projects"
          className="cyber-button-primary text-sm px-4 py-2 inline-block"
        >
          Browse Projects
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: Application["status"]) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-900 text-yellow-300";
      case "Accepted":
        return "bg-green-900 text-green-300";
      case "Rejected":
        return "bg-red-900 text-red-300";
      default:
        return "bg-gray-800 text-gray-300";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl text-cyber-neon font-bold">Your Applications</h2>
        <Link
          href="/ngo/projects"
          className="cyber-button-primary text-sm px-4 py-2 inline-block"
        >
          Browse Projects
        </Link>
      </div>

      {selectedApplication ? (
        <ApplicationDetail
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {applications.map((application) => (
            <div key={application.id} className="cyber-card-inner p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg text-cyber-purple font-medium mb-1">
                    {application.projectName}
                  </h3>
                  <p className="text-sm text-gray-400 mb-1">
                    Company: {application.companyName}
                  </p>
                  <div className="flex items-center mb-2">
                    <span className="text-xs text-gray-400 mr-2">Status:</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${getStatusColor(
                        application.status
                      )}`}
                    >
                      {application.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mb-1">
                    Amount: {application.amount} USDC
                  </div>
                  <div className="text-xs text-gray-400">
                    Submitted:{" "}
                    {new Date(application.submittedAt).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedApplication(application)}
                  className="cyber-button-secondary text-sm px-4 py-2"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main applications page component
const NgoApplicationsPage = () => {
  const { connected } = useWallet();
  const [ngoExists, setNgoExists] = useState(false);
  const [ngoCheckError, setNgoCheckError] = useState<string | null>(null);

  const handleNgoState = (exists: boolean) => {
    setNgoExists(exists);
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
              My Applications
            </h1>
            <p className="text-gray-400">
              View and manage your project applications
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <Link
              href="/ngo"
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
              Back to Dashboard
            </Link>
            <WalletButton />
          </div>
        </div>

        {!connected ? (
          <div className="cyber-card p-8 text-center">
            <p className="text-xl text-cyber-pink mb-4">Wallet Not Connected</p>
            <p className="text-gray-400 mb-6">
              Please connect your wallet to view your applications
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
              onNgoStateChange={handleNgoState}
              onError={handleNgoCheckError}
            />

            {/* Only show application list if NGO exists */}
            {ngoExists && (
              <div className="cyber-card p-6">
                <ApplicationList />
              </div>
            )}
          </div>
        )}
      </div>
    </TransactionProvider>
  );
};

export default NgoApplicationsPage;
