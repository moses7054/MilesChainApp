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
import { PublicKey } from "@solana/web3.js";
import {
  checkCompanyAccount,
  fetchCompanyData,
  initializeCompanyDirect,
} from "./utils/companyAccount";
import { LoadingSpinner } from "../components/LoadingSpinner";

// Extract components from the default export
const {
  Form: CyberForm,
  Input: CyberInput,
  Submit: CyberSubmit,
  Section: CyberFormSection,
} = CyberFormComponents;

// Company initialization form component
interface CompanyInitFormProps {
  companyAccountState: {
    exists: boolean;
    isCompanyWallet: boolean;
  };
}

const CompanyInitForm: React.FC<CompanyInitFormProps> = ({
  companyAccountState,
}) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { handleTransaction } = useTransactionHandler();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    businessRegNum: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoadingCompanyData, setIsLoadingCompanyData] = useState(false);

  // Fetch company data when the component mounts if the company exists
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (companyAccountState.exists && wallet.publicKey) {
        try {
          setIsLoadingCompanyData(true);
          // This is a placeholder - you'll need to implement a function to fetch the full company data
          // including name and business registration number
          console.log(
            "Fetching company details for:",
            wallet.publicKey.toString()
          );

          // For now, we'll just set some placeholder data
          // In a real implementation, you would fetch this from the blockchain
          setFormData({
            name: "Your Company Name", // Replace with actual fetched data
            businessRegNum: "Your Business Reg Number", // Replace with actual fetched data
          });
        } catch (error) {
          console.error("Error fetching company details:", error);
        } finally {
          setIsLoadingCompanyData(false);
        }
      }
    };

    fetchCompanyDetails();
  }, [companyAccountState.exists, wallet.publicKey, connection]);

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
      newErrors.name = "Company name is required";
    } else if (formData.name.length > 40) {
      newErrors.name = "Company name must be 40 characters or less";
    }

    if (!formData.businessRegNum) {
      newErrors.businessRegNum = "Business registration number is required";
    } else if (formData.businessRegNum.length > 24) {
      newErrors.businessRegNum =
        "Business registration number must be 24 characters or less";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const initializeCompany = async () => {
    try {
      if (!wallet.publicKey || !wallet.signTransaction) {
        throw new Error("Wallet not connected or doesn't support signing");
      }

      // Get parameters from the form
      const name = formData.name;
      const businessRegNum = formData.businessRegNum;

      console.log("Initializing company with:", {
        name,
        businessRegNum,
        walletAddress: wallet.publicKey.toString(),
      });

      // Use the direct method instead of Anchor program
      const txSignature = await initializeCompanyDirect(
        connection,
        wallet.publicKey,
        name,
        businessRegNum,
        wallet.signTransaction
      );

      return txSignature;
    } catch (error) {
      console.error("Error initializing company:", error);
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
        initializeCompany(),
        "Initializing company account...",
        "Company account initialized successfully!",
        "Failed to initialize company account"
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
      label: "Company Name",
      value: formData.name,
    },
    {
      label: "Business Registration Number",
      value: formData.businessRegNum,
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

  const confirmationMessage = companyAccountState.exists
    ? "Please review the updated company information before confirming."
    : "You are about to initialize a company account. This wallet will be linked to the company and will be able to create projects.";

  return (
    <div className="max-w-md mx-auto">
      <CyberForm onSubmit={handleSubmit}>
        <CyberFormSection
          title={
            companyAccountState.exists ? "Edit Company" : "Company Registration"
          }
        >
          {companyAccountState.exists ? (
            <p className="text-sm text-gray-400 mb-4">
              Update your company information below.
            </p>
          ) : (
            <div className="mb-6 border-l-4 border-cyber-neon p-4 bg-opacity-10 bg-cyber-neon">
              <h3 className="text-cyber-neon font-medium mb-2">
                Company Registration
              </h3>
              <p className="text-sm text-gray-400 mb-2">
                <span className="text-cyber-pink font-medium">
                  No company account found.
                </span>{" "}
                Register your company to start creating projects on the
                Milestone Protocol.
              </p>
              <p className="text-sm text-gray-400">
                As a registered company, you&apos;ll be able to:
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Create new projects</li>
                  <li>Fund NGOs to complete your projects</li>
                  <li>Track project completion status</li>
                </ul>
              </p>
            </div>
          )}

          {isLoadingCompanyData ? (
            <div className="flex justify-center items-center p-4">
              <LoadingSpinner />
              <span className="ml-2">Loading company data...</span>
            </div>
          ) : (
            <>
              <CyberInput
                label="Company Name"
                name="name"
                id="name"
                type="text"
                inputSize="md"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your company name (max 40 chars)"
                error={errors.name}
                required
                maxLength={40}
              />

              <CyberInput
                label="Business Registration Number"
                name="businessRegNum"
                id="businessRegNum"
                type="text"
                inputSize="md"
                value={formData.businessRegNum}
                onChange={handleChange}
                placeholder="Enter your business registration number (max 24 chars)"
                error={errors.businessRegNum}
                required
                maxLength={24}
              />
            </>
          )}
        </CyberFormSection>

        {errors.submit && (
          <div className="text-cyber-pink text-sm mt-4">{errors.submit}</div>
        )}

        <CyberSubmit
          value={
            companyAccountState.exists ? "Edit Company" : "Register Company"
          }
          isLoading={isLoading || isLoadingCompanyData}
          disabled={isLoadingCompanyData}
        />
      </CyberForm>

      {/* Transaction Confirmation Modal */}
      <TransactionConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmTransaction}
        title={
          companyAccountState.exists
            ? "Confirm Company Update"
            : "Confirm Company Registration"
        }
        message={confirmationMessage}
        confirmButtonText={companyAccountState.exists ? "Update" : "Register"}
        cancelButtonText="Cancel"
        details={confirmationDetails}
      />
    </div>
  );
};

// Main company page component
const CompanyPage = () => {
  const { connected } = useWallet();
  const [companyAccountState, setCompanyAccountState] = useState<{
    exists: boolean;
    isCompanyWallet: boolean;
  }>({
    exists: false,
    isCompanyWallet: false,
  });
  const [companyCheckError, setCompanyCheckError] = useState<string | null>(
    null
  );

  const handleCompanyAccountState = (
    exists: boolean,
    isCompanyWallet: boolean
  ) => {
    setCompanyAccountState({ exists, isCompanyWallet });
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
              Company Dashboard
            </h1>
            <p className="text-gray-400">
              {companyAccountState.exists
                ? "Manage your company and create projects on the Milestone Protocol"
                : "Register your company and create projects on the Milestone Protocol"}
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
              Please connect your wallet to access the company dashboard
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
              onCompanyStateChange={handleCompanyAccountState}
              onError={handleCompanyCheckError}
            />

            {/* Only show company registration/edit form if not registered or if editing */}
            {(!companyAccountState.exists ||
              companyAccountState.isCompanyWallet) && (
              <div className="cyber-card p-6">
                <CompanyInitForm companyAccountState={companyAccountState} />
              </div>
            )}

            {/* Only show company actions if the company exists */}
            {companyAccountState.exists && (
              <div className="cyber-card p-6">
                <h2 className="text-xl text-cyber-neon mb-4">
                  Company Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="cyber-card-inner p-4">
                    <h3 className="text-lg text-cyber-purple mb-2">
                      Create Project
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Create a new project and fund it with USDC
                    </p>
                    <Link
                      href="/company/projects/create"
                      className="cyber-button-primary text-sm px-4 py-2 inline-block"
                    >
                      Create New Project
                    </Link>
                  </div>

                  <div className="cyber-card-inner p-4">
                    <h3 className="text-lg text-cyber-purple mb-2">
                      Manage Projects
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      View and manage your existing projects
                    </p>
                    <Link
                      href="/company/projects"
                      className="cyber-button-secondary text-sm px-4 py-2 inline-block"
                    >
                      View Projects
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

// Check if a company account exists
const CompanyCheck: React.FC<{
  onCompanyStateChange: (exists: boolean, isCompanyWallet: boolean) => void;
  onError?: (errorMessage: string) => void;
}> = ({ onCompanyStateChange, onError }) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(true);
  const [companyExists, setCompanyExists] = useState(false);
  const [companyData, setCompanyData] = useState<{
    companyPDA: PublicKey;
    signer?: PublicKey;
  } | null>(null);
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
    const checkCompany = async () => {
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
          "Starting company account check for wallet:",
          publicKey.toString()
        );

        // Use our utility function to check if the company account exists
        const result = await checkCompanyAccount(connection, publicKey);
        console.log("Company check result:", result);
        const exists = result.companyExists;

        setCompanyExists(exists);

        if (exists) {
          // If the account exists, fetch company data
          const data = await fetchCompanyData(connection, publicKey);
          console.log("Company data fetched:", data);
          setCompanyData(data);
        }

        // Since this is the company's wallet checking its own company account,
        // if it exists, they have company privileges
        onCompanyStateChange(exists, exists);
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
        setCheckAttempted(true);
      }
    };

    // Only run this effect once per wallet
    let mounted = true;
    checkCompany().then(() => {
      if (!mounted) {
        console.log("Component unmounted during company check");
      }
    });

    return () => {
      mounted = false;
    };
  }, [connection, publicKey, onCompanyStateChange, onError, checkAttempted]);

  // Add a button to retry the check if it failed
  const retryCheck = () => {
    setCheckAttempted(false);
    setError(null);
  };

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
        <h2 className="text-xl text-cyber-neon font-bold mb-4">
          Company Account
        </h2>
        <p className="text-gray-400">
          Please connect your wallet to check company status.
        </p>
      </div>
    );
  }

  return (
    <div className="cyber-card p-4 mb-6">
      <h2 className="text-xl text-cyber-neon font-bold mb-4">
        Company Account Status
      </h2>

      {!companyExists ? (
        <div className="mb-2 flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <span className="text-yellow-400 font-medium">
            No company account found for this wallet
          </span>
        </div>
      ) : (
        <div>
          <div className="mb-2 flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-green-400 font-medium">
              Company account exists for this wallet
            </span>
          </div>

          {companyData && (
            <div className="mt-4 border-t border-gray-700 pt-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-400">Company PDA:</div>
                <div className="text-white break-all">
                  {companyData.companyPDA.toString()}
                </div>

                {companyData.signer && (
                  <>
                    <div className="text-gray-400">Company Signer:</div>
                    <div className="text-white break-all">
                      {companyData.signer.toString()}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyPage;
