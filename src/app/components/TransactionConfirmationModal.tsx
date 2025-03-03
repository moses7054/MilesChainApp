"use client";

import React, { useState, useEffect } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

export interface TransactionConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  details?: {
    label: string;
    value: string | number;
  }[];
}

export const TransactionConfirmationModal: React.FC<
  TransactionConfirmationModalProps
> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  details = [],
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      setTimeout(() => {
        setVisible(false);
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen && !visible) {
    return null;
  }

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("Transaction confirmation error:", error);
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
        onClick={!isProcessing ? onClose : undefined}
      ></div>

      <div className="cyber-card w-full max-w-md relative z-10 transform transition-transform duration-300 scale-100">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-cyber-neon mb-2">
              {title}
            </h2>
            <p className="text-gray-300">{message}</p>
          </div>

          {details.length > 0 && (
            <div className="mb-6 space-y-3 border border-cyber-purple rounded-md p-3 bg-black bg-opacity-50">
              {details.map((detail, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-400">{detail.label}:</span>
                  <span className="text-cyber-neon font-mono">
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-row-reverse space-x-reverse space-x-4">
            <button
              type="button"
              className="cyber-button py-2 px-4 border-cyber-pink text-cyber-pink hover:text-white"
              onClick={handleConfirm}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="sm" />
                  <span>Processing...</span>
                </div>
              ) : (
                confirmButtonText
              )}
            </button>

            <button
              type="button"
              className="cyber-button py-2 px-4"
              onClick={onClose}
              disabled={isProcessing}
            >
              {cancelButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionConfirmationModal;
