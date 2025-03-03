"use client";

import React, { useEffect, useState } from "react";

export type TransactionStatus = "idle" | "pending" | "success" | "error";

interface TransactionStatusProps {
  status: TransactionStatus;
  message?: string;
  txHash?: string;
  onClose?: () => void;
  explorerUrl?: string;
  className?: string;
}

export const TransactionStatusIndicator: React.FC<TransactionStatusProps> = ({
  status,
  message,
  txHash,
  onClose,
  explorerUrl,
  className = "",
}) => {
  const [visible, setVisible] = useState(false);
  const [displayMessage, setDisplayMessage] = useState(message);

  useEffect(() => {
    if (status !== "idle") {
      setVisible(true);
    }

    // Set default messages based on status
    if (!message) {
      switch (status) {
        case "pending":
          setDisplayMessage("Transaction in progress...");
          break;
        case "success":
          setDisplayMessage("Transaction successful!");
          break;
        case "error":
          setDisplayMessage("Transaction failed. Please try again.");
          break;
        default:
          setDisplayMessage("");
      }
    } else {
      setDisplayMessage(message);
    }

    // Auto-hide after 5 seconds for success and error
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) setTimeout(onClose, 300);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status, message, onClose]);

  if (!visible || status === "idle") return null;

  const statusColors = {
    pending: "border-cyber-neon text-cyber-neon",
    success: "border-green-500 text-green-400",
    error: "border-cyber-pink text-cyber-pink",
  };

  const statusIcons = {
    pending: (
      <svg
        className="animate-spin h-5 w-5 mr-2"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    ),
    success: (
      <svg
        className="h-5 w-5 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    error: (
      <svg
        className="h-5 w-5 mr-2"
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
    ),
  };

  return (
    <div
      className={`cyber-card fixed bottom-6 right-6 p-4 max-w-sm transition-all duration-300 transform ${
        visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      } ${statusColors[status]} ${className}`}
      style={{
        zIndex: 1000,
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">{statusIcons[status]}</div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium">{displayMessage}</p>
          {txHash && (
            <div className="mt-2 flex space-x-7">
              {explorerUrl && (
                <a
                  href={`${explorerUrl}${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs underline hover:text-white cursor-pointer"
                >
                  View on Explorer
                </a>
              )}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(txHash);
                }}
                className="text-xs underline hover:text-white cursor-pointer"
              >
                Copy Tx Hash
              </button>
            </div>
          )}
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className="inline-flex text-white focus:outline-none focus:text-gray-300"
            onClick={() => {
              setVisible(false);
              if (onClose) setTimeout(onClose, 300);
            }}
          >
            <svg
              className="h-5 w-5"
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
      </div>
    </div>
  );
};

// Context to manage transaction status globally
import { createContext, useContext, ReactNode } from "react";

interface TransactionContextType {
  status: TransactionStatus;
  message: string;
  txHash: string;
  explorerUrl: string;
  setStatus: (status: TransactionStatus) => void;
  setMessage: (message: string) => void;
  setTxHash: (hash: string) => void;
  reset: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

export const TransactionProvider: React.FC<{
  children: ReactNode;
  explorerUrl?: string;
}> = ({ children, explorerUrl = "https://explorer.solana.com/tx/" }) => {
  const [status, setStatus] = useState<TransactionStatus>("idle");
  const [message, setMessage] = useState("");
  const [txHash, setTxHash] = useState("");

  const reset = () => {
    setStatus("idle");
    setMessage("");
    setTxHash("");
  };

  return (
    <TransactionContext.Provider
      value={{
        status,
        message,
        txHash,
        explorerUrl,
        setStatus,
        setMessage,
        setTxHash,
        reset,
      }}
    >
      {children}
      <TransactionStatusIndicator
        status={status}
        message={message}
        txHash={txHash}
        explorerUrl={explorerUrl}
        onClose={reset}
      />
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error("useTransaction must be used within a TransactionProvider");
  }
  return context;
};

// Hook for common transaction operations
export const useTransactionHandler = () => {
  const { setStatus, setMessage, setTxHash, reset } = useTransaction();

  const handleTransaction = async (
    transactionPromise: Promise<string>,
    pendingMessage = "Processing transaction...",
    successMessage = "Transaction successful!",
    errorMessage = "Transaction failed"
  ) => {
    try {
      setStatus("pending");
      setMessage(pendingMessage);
      setTxHash("");

      const txHash = await transactionPromise;

      setStatus("success");
      setMessage(successMessage);
      setTxHash(txHash);

      return { success: true, txHash };
    } catch (error) {
      console.error("Transaction error:", error);

      setStatus("error");
      setMessage(
        error instanceof Error
          ? `${errorMessage}: ${error.message}`
          : errorMessage
      );

      return { success: false, error };
    }
  };

  return {
    handleTransaction,
    reset,
  };
};

// Create a named variable for the default export
const TransactionStatusComponents = {
  TransactionStatusIndicator,
  TransactionProvider,
  useTransaction,
  useTransactionHandler,
};

export default TransactionStatusComponents;
