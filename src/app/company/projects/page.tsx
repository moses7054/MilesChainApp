"use client";

import React, { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import WalletButton from "../../components/WalletButton";
import { checkCompanyAccount } from "../utils/companyAccount";

// Placeholder project data type
interface Project {
  id: string;
  name: string;
  status: string;
  requirementsHash: string;
  maxSubmissions: number;
  totalSubmissions: number;
}

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
          You need to register a company before you can view projects.
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

// Project list component
const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

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
          },
          {
            id: "project-2",
            name: "Clean Water Access Program",
            status: "Funded",
            requirementsHash: "0x456...",
            maxSubmissions: 3,
            totalSubmissions: 1,
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
        <span className="ml-2">Loading projects...</span>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="cyber-card-inner p-8 text-center">
        <p className="text-xl text-cyber-pink mb-4">No Projects Found</p>
        <p className="text-gray-400 mb-6">
          You haven&apos;t created any projects yet.
        </p>
        <Link
          href="/company/projects/create"
          className="cyber-button-primary text-sm px-4 py-2 inline-block"
        >
          Create Your First Project
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl text-cyber-neon font-bold">Your Projects</h2>
        <Link
          href="/company/projects/create"
          className="cyber-button-primary text-sm px-4 py-2 inline-block"
        >
          Create New Project
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="cyber-card-inner p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg text-cyber-purple font-medium mb-1">
                  {project.name}
                </h3>
                <div className="flex items-center mb-2">
                  <span className="text-xs text-gray-400 mr-2">Status:</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      project.status === "OpenForApplication"
                        ? "bg-green-900 text-green-300"
                        : project.status === "Funded"
                        ? "bg-blue-900 text-blue-300"
                        : "bg-gray-800 text-gray-300"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  Applications: {project.totalSubmissions} /{" "}
                  {project.maxSubmissions}
                </div>
              </div>
              <Link
                href={`/company/projects/${project.id}`}
                className="text-cyber-purple hover:text-cyber-pink transition-colors text-sm"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main projects page component
const ProjectsPage = () => {
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
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-cyber-neon mb-2">
            Company Projects
          </h1>
          <p className="text-gray-400">
            View and manage your projects on the Milestone Protocol
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
            Please connect your wallet to view your projects
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

          {/* Only show project list if company exists */}
          {companyExists && (
            <div className="cyber-card p-6">
              <ProjectList />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
