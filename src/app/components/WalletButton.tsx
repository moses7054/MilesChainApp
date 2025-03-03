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
    <div className="relative scale-[0.65] xs:scale-75 sm:scale-90 md:scale-100 origin-right">
      {connected ? (
        <div className="cyber-card flex flex-row items-center p-0 xs:p-0.5 sm:p-1 max-w-[180px] xs:max-w-[200px] sm:max-w-none">
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 xs:w-2 sm:w-3 xs:h-2 sm:h-3 bg-green-500 rounded-full mr-0.5 xs:mr-1 sm:mr-2 animate-pulse"></div>
            <span className="text-cyber-pink text-[10px] xs:text-xs sm:text-sm md:text-base truncate">
              {address}
            </span>
          </div>
          <button
            onClick={handleDisconnect}
            className="cyber-button text-[10px] xs:text-xs sm:text-sm py-0 xs:py-0.5 px-0.5 xs:px-1 ml-0.5 xs:ml-1 sm:ml-2 whitespace-nowrap min-w-[12px] h-[16px] xs:h-[18px] sm:h-[20px] flex items-center justify-center"
          >
            X
          </button>
        </div>
      ) : (
        <div className="cyber-button-wrapper">
          <WalletMultiButton className="cyber-button bg-transparent py-0 xs:py-0 sm:py-0 px-0.5 xs:px-1 sm:px-2 text-[10px] xs:text-xs sm:text-sm md:text-base whitespace-nowrap mini-wallet-btn" />
        </div>
      )}
    </div>
  );
};

export default WalletButton;
