"use client";

import React from "react";
import {
  TransactionProvider,
  useTransaction,
  useTransactionHandler,
} from "./TransactionStatus";

// This is a mock function to simulate a blockchain transaction
const mockTransaction = async (
  shouldSucceed = true,
  delay = 2000
): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldSucceed) {
        resolve(
          "47zL6VxLGbXZuHFocHYVU23RWt8v8fYPpkrbtZ6a3xnBZMHSZb5eVADeV2sBpTKZpLX9XWnDpLwrQNC1GJZrxHet"
        );
      } else {
        reject(new Error("Transaction simulation failed"));
      }
    }, delay);
  });
};

// The inner component that demonstrates transaction handling
const TransactionButtons = () => {
  const { status } = useTransaction();
  const { handleTransaction, reset } = useTransactionHandler();

  const simulateSuccessfulTransaction = async () => {
    await handleTransaction(
      mockTransaction(true, 3000),
      "Sending transaction to the blockchain...",
      "Your transaction was processed successfully!",
      "Transaction failed"
    );
  };

  const simulateFailedTransaction = async () => {
    await handleTransaction(
      mockTransaction(false, 2000),
      "Processing your request...",
      "Success!",
      "Transaction failed"
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <button
          onClick={simulateSuccessfulTransaction}
          disabled={status === "pending"}
          className="cyber-button px-6 py-2 disabled:opacity-50"
        >
          Simulate Successful Transaction
        </button>

        <button
          onClick={simulateFailedTransaction}
          disabled={status === "pending"}
          className="cyber-button px-6 py-2 disabled:opacity-50"
        >
          Simulate Failed Transaction
        </button>
      </div>

      {(status === "success" || status === "error") && (
        <button onClick={reset} className="text-cyber-neon underline text-sm">
          Reset Status
        </button>
      )}

      <div className="mt-6 p-4 cyber-card">
        <h3 className="text-cyber-neon mb-2">Current Status:</h3>
        <div className="pl-4 border-l-2 border-cyber-purple">
          <p className="text-white">
            {status === "idle" && "Idle - No transaction in progress"}
            {status === "pending" && "Transaction in progress..."}
            {status === "success" && "Transaction completed successfully!"}
            {status === "error" && "Transaction failed!"}
          </p>
        </div>
      </div>
    </div>
  );
};

// The wrapper component with provider
export const TransactionStatusExample = () => {
  return (
    <div className="max-w-md mx-auto my-10">
      <h2 className="text-cyber-neon text-2xl font-bold mb-6">
        Transaction Status Demo
      </h2>

      <TransactionProvider>
        <TransactionButtons />
      </TransactionProvider>
    </div>
  );
};

export default TransactionStatusExample;
