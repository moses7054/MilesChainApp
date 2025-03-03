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

// Placeholder project data type
interface Project {
  id: string;
  name: string;
  status: string;
  requirementsHash: string;
  maxSubmissions: number;
  totalSubmissions: number;
  companyName: string;
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
          You need to register an NGO before you can browse projects.
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

// Project application component
const ProjectApplication: React.FC<{
  project: Project;
  onClose: () => void;
}> = ({ project, onClose }) => {
  const wallet = useWallet();
  const { handleTransaction } = useTransactionHandler();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    requirementsHash: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

  const applyForProject = async () => {
    try {
      if (!wallet.publicKey || !wallet.signTransaction) {
        throw new Error("Wallet not connected or doesn't support signing");
      }

      console.log("Applying for project with:", {
        projectId: project.id,
        projectName: project.name,
        requirementsHash: formData.requirementsHash,
        walletAddress: wallet.publicKey.toString(),
      });

      // This is a placeholder - you'll need to implement the actual project application
      // Simulate a transaction for now
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return "simulated-transaction-signature";
    } catch (error) {
      console.error("Error applying for project:", error);
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
        applyForProject(),
        "Applying for project...",
        "Project application submitted successfully!",
        "Failed to apply for project"
      );
      onClose(); // Close the application form after successful submission
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
      value: project.name,
    },
    {
      label: "Company",
      value: project.companyName,
    },
    {
      label: "Requirements Hash",
      value: formData.requirementsHash,
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

  const confirmationMessage =
    "You are about to apply for this project. This will require a transaction to be signed.";

  return (
    <div className="cyber-card-inner p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl text-cyber-neon font-bold">Apply for Project</h3>
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
        <h4 className="text-lg text-cyber-purple mb-2">{project.name}</h4>
        <p className="text-sm text-gray-400 mb-2">
          Company: {project.companyName}
        </p>
        <p className="text-sm text-gray-400 mb-2">
          Amount: {project.amount} USDC
        </p>
        <p className="text-sm text-gray-400">
          Applications: {project.totalSubmissions} / {project.maxSubmissions}
        </p>
      </div>

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
              errors.requirementsHash ? "border-cyber-pink" : "border-gray-700"
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
            onClick={onClose}
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
                <span className="ml-2">Applying...</span>
              </span>
            ) : (
              "Apply"
            )}
          </button>
        </div>
      </form>

      {/* Transaction Confirmation Modal */}
      <TransactionConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmTransaction}
        title="Confirm Project Application"
        message={confirmationMessage}
        confirmButtonText="Apply"
        cancelButtonText="Cancel"
        details={confirmationDetails}
      />
    </div>
  );
};

// Project list component
const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    // Simulate fetching projects
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // This is a placeholder - you'll need to implement the actual project fetching logic

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data for now
        const mockProjects: Project[] = [
          {
            id: "project-1",
            name: "Sustainable Energy Initiative",
            status: "OpenForApplication",
            requirementsHash: "0x123...",
            maxSubmissions: 5,
            totalSubmissions: 2,
            companyName: "EcoTech Solutions",
            amount: 1000,
          },
          {
            id: "project-2",
            name: "Clean Water Access Program",
            status: "OpenForApplication",
            requirementsHash: "0x456...",
            maxSubmissions: 3,
            totalSubmissions: 1,
            companyName: "Global Health Partners",
            amount: 750,
          },
          {
            id: "project-3",
            name: "Education Technology for Rural Areas",
            status: "OpenForApplication",
            requirementsHash: "0x789...",
            maxSubmissions: 4,
            totalSubmissions: 0,
            companyName: "Future Learning Inc.",
            amount: 1200,
          },
        ];

        setProjects(mockProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoadingSpinner />
        <span className="ml-2">Loading available projects...</span>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="cyber-card-inner p-8 text-center">
        <p className="text-xl text-cyber-pink mb-4">No Projects Available</p>
        <p className="text-gray-400 mb-6">
          There are no projects available for application at this time.
        </p>
        <Link
          href="/ngo"
          className="cyber-button-secondary text-sm px-4 py-2 inline-block"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl text-cyber-neon font-bold">
          Available Projects
        </h2>
      </div>

      {selectedProject ? (
        <ProjectApplication
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="cyber-card-inner p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg text-cyber-purple font-medium mb-1">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-1">
                    Company: {project.companyName}
                  </p>
                  <div className="flex items-center mb-2">
                    <span className="text-xs text-gray-400 mr-2">Status:</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-green-900 text-green-300">
                      {project.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mb-1">
                    Applications: {project.totalSubmissions} /{" "}
                    {project.maxSubmissions}
                  </div>
                  <div className="text-xs text-gray-400">
                    Amount: {project.amount} USDC
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProject(project)}
                  className="cyber-button-primary text-sm px-4 py-2"
                >
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main projects page component
const NgoProjectsPage = () => {
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
              Available Projects
            </h1>
            <p className="text-gray-400">
              Browse and apply for projects on the Milestone Protocol
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
              Please connect your wallet to view available projects
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

            {/* Only show project list if NGO exists */}
            {ngoExists && (
              <div className="cyber-card p-6">
                <ProjectList />
              </div>
            )}
          </div>
        )}
      </div>
    </TransactionProvider>
  );
};

export default NgoProjectsPage;
