"use client";

import { FC, useCallback, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export const WalletButton: FC = () => {
  const { publicKey, disconnect, connected } = useWallet();
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    if (publicKey) {
      const pubKeyStr = publicKey.toString();
      // Truncate the address for display
      setAddress(`${pubKeyStr.slice(0, 4)}...${pubKeyStr.slice(-4)}`);
    } else {
      setAddress("");
    }
  }, [publicKey]);

  const handleDisconnect = useCallback(async () => {
    await disconnect();
  }, [disconnect]);

  return (
    <div className="relative">
      {connected ? (
        <div className="cyber-card flex flex-col sm:flex-row items-center p-2 sm:p-3">
          <div className="flex items-center">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-cyber-pink text-sm sm:text-base">
              {address}
            </span>
          </div>
          <button
            onClick={handleDisconnect}
            className="cyber-button text-xs sm:text-sm py-1 px-2 sm:px-3 mt-2 sm:mt-0 sm:ml-3"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div className="cyber-button-wrapper">
          <WalletMultiButton className="cyber-button !bg-transparent !py-2 !px-3 sm:!py-3 sm:!px-4 text-sm sm:text-base" />
        </div>
      )}
    </div>
  );
};

export default WalletButton;
