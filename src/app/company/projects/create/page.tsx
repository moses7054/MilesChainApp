"use client";

import React, { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import Link from "next/link";
import CyberFormComponents from "../../../components/CyberForm";
import {
  TransactionProvider,
  useTransactionHandler,
} from "../../../components/TransactionStatus";
import WalletButton from "../../../components/WalletButton";
import TransactionConfirmationModal from "../../../components/TransactionConfirmationModal";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { checkCompanyAccount } from "../../utils/companyAccount";

// Extract components from the default export
const {
  Form: CyberForm,
  Input: CyberInput,
  Submit: CyberSubmit,
  Section: CyberFormSection,
} = CyberFormComponents;

// Project creation form component
const ProjectCreationForm: React.FC = () => {
  const wallet = useWallet();
  const { handleTransaction } = useTransactionHandler();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    projectName: "",
    requirementsHash: "",
    maxSubmissions: "5",
    amount: "100",
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

    if (!formData.projectName) {
      newErrors.projectName = "Project name is required";
    } else if (formData.projectName.length > 30) {
      newErrors.projectName = "Project name must be 30 characters or less";
    }

    if (!formData.requirementsHash) {
      newErrors.requirementsHash = "Requirements hash is required";
    }

    if (!formData.maxSubmissions) {
      newErrors.maxSubmissions = "Maximum submissions is required";
    } else if (
      isNaN(Number(formData.maxSubmissions)) ||
      Number(formData.maxSubmissions) <= 0
    ) {
      newErrors.maxSubmissions =
        "Maximum submissions must be a positive number";
    }

    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = "Amount must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createProject = async () => {
    try {
      if (!wallet.publicKey || !wallet.signTransaction) {
        throw new Error("Wallet not connected or doesn't support signing");
      }

      // This is a placeholder - you'll need to implement the actual project creation logic
      console.log("Creating project with:", {
        projectName: formData.projectName,
        requirementsHash: formData.requirementsHash,
        maxSubmissions: formData.maxSubmissions,
        amount: formData.amount,
        walletAddress: wallet.publicKey.toString(),
      });

      // Simulate a transaction for now
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return "simulated-transaction-signature";
    } catch (error) {
      console.error("Error creating project:", error);
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
        createProject(),
        "Creating project...",
        "Project created successfully!",
        "Failed to create project"
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
      label: "Project Name",
      value: formData.projectName,
    },
    {
      label: "Requirements Hash",
      value: formData.requirementsHash,
    },
    {
      label: "Maximum Submissions",
      value: formData.maxSubmissions,
    },
    {
      label: "Amount (USDC)",
      value: formData.amount,
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
    "You are about to create a new project. This will require a transaction to be signed and will deposit USDC into the project vault.";

  return (
    <div className="max-w-md mx-auto">
      <CyberForm onSubmit={handleSubmit}>
        <CyberFormSection title="Create New Project">
          <p className="text-sm text-gray-400 mb-4">
            Fill out the details below to create a new project. This will
            require a transaction to be signed.
          </p>

          <CyberInput
            label="Project Name"
            name="projectName"
            id="projectName"
            type="text"
            inputSize="md"
            value={formData.projectName}
            onChange={handleChange}
            placeholder="Enter project name (max 30 chars)"
            error={errors.projectName}
            required
            maxLength={30}
          />

          <CyberInput
            label="Requirements Hash"
            name="requirementsHash"
            id="requirementsHash"
            type="text"
            inputSize="md"
            value={formData.requirementsHash}
            onChange={handleChange}
            placeholder="Enter requirements hash (32 bytes)"
            error={errors.requirementsHash}
            required
          />

          <CyberInput
            label="Maximum Submissions"
            name="maxSubmissions"
            id="maxSubmissions"
            type="number"
            inputSize="md"
            value={formData.maxSubmissions}
            onChange={handleChange}
            placeholder="Enter maximum allowed submissions"
            error={errors.maxSubmissions}
            required
            min={1}
          />

          <CyberInput
            label="Amount (USDC)"
            name="amount"
            id="amount"
            type="number"
            inputSize="md"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount in USDC"
            error={errors.amount}
            required
            min={1}
          />
        </CyberFormSection>

        {errors.submit && (
          <div className="text-cyber-pink text-sm mt-4">{errors.submit}</div>
        )}

        <CyberSubmit value="Create Project" isLoading={isLoading} />
      </CyberForm>

      {/* Transaction Confirmation Modal */}
      <TransactionConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmTransaction}
        title="Confirm Project Creation"
        message={confirmationMessage}
        confirmButtonText="Create"
        cancelButtonText="Cancel"
        details={confirmationDetails}
      />
    </div>
  );
};

// Company check component
const CompanyCheck: React.FC<{
  onCompanyStateChange: (exists: boolean) => void;
  onError?: (errorMessage: string) => void;
}> = ({ onCompanyStateChange, onError }) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(true);
  const [companyExists, setCompanyExists] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkCompany = async () => {
      if (!publicKey) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log(
          "Starting company account check for wallet:",
          publicKey.toString()
        );

        // Use our utility function to check if the company account exists
        const result = await checkCompanyAccount(connection, publicKey);
        console.log("Company check result:", result);
        const exists = result.companyExists;

        setCompanyExists(exists);
        onCompanyStateChange(exists);
      } catch (err) {
        console.error("Error checking company account:", err);
        const errorMsg =
          "Failed to check company account: " +
          (err instanceof Error ? err.message : String(err));
        setError(errorMsg);
        if (onError) {
          onError(errorMsg);
        }
      } finally {
        setLoading(false);
      }
    };

    checkCompany();
  }, [connection, publicKey, onCompanyStateChange, onError]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoadingSpinner />
        <span className="ml-2">Checking company account...</span>
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
        <h2 className="text-xl text-cyber-neon font-bold mb-4">
          Company Account
        </h2>
        <p className="text-gray-400">
          Please connect your wallet to check company status.
        </p>
      </div>
    );
  }

  if (!companyExists) {
    return (
      <div className="cyber-card p-4 mb-6">
        <h2 className="text-xl text-cyber-pink font-bold mb-4">
          No Company Account Found
        </h2>
        <p className="text-gray-400 mb-4">
          You need to register a company before you can create projects.
        </p>
        <Link
          href="/company"
          className="cyber-button-primary text-sm px-4 py-2 inline-block"
        >
          Register Company
        </Link>
      </div>
    );
  }

  return null; // If company exists, don't show anything
};

// Main project creation page component
const ProjectCreationPage = () => {
  const { connected } = useWallet();
  const [companyExists, setCompanyExists] = useState(false);
  const [companyCheckError, setCompanyCheckError] = useState<string | null>(
    null
  );

  const handleCompanyState = (exists: boolean) => {
    setCompanyExists(exists);
  };

  const handleCompanyCheckError = (errorMessage: string) => {
    console.error("Company check error:", errorMessage);
    setCompanyCheckError(errorMessage);
  };

  return (
    <TransactionProvider>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-cyber-neon mb-2">
              Create New Project
            </h1>
            <p className="text-gray-400">
              Create a new project and fund it with USDC
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <Link
              href="/company"
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
              Please connect your wallet to create a project
            </p>
          </div>
        ) : companyCheckError ? (
          <div className="cyber-card p-8">
            <h2 className="text-xl text-cyber-pink mb-4">
              Error Checking Company Account
            </h2>
            <p className="text-gray-400 mb-4">{companyCheckError}</p>
            <button
              onClick={() => setCompanyCheckError(null)}
              className="px-4 py-2 bg-cyber-purple text-white rounded hover:bg-cyber-pink transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {/* Company Check Component */}
            <CompanyCheck
              onCompanyStateChange={handleCompanyState}
              onError={handleCompanyCheckError}
            />

            {/* Only show project creation form if company exists */}
            {companyExists && (
              <div className="cyber-card p-6">
                <ProjectCreationForm />
              </div>
            )}
          </div>
        )}
      </div>
    </TransactionProvider>
  );
};

export default ProjectCreationPage;
