// @ts-nocheck

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Wallet from "@project-serum/sol-wallet-adapter";

import useLocalStorageState from "./useLocalStorageState";

const ASSET_URL =
  "https://cdn.jsdelivr.net/gh/solana-labs/oyster@main/assets/wallets";

export const WALLET_PROVIDERS = [
  {
    name: "Sollet.io",
    url: "https://www.sollet.io",
    icon: `${ASSET_URL}/sollet.svg`,
  },
  {
    name: "Phantom",
    url: "https://www.sollet.io",
    icon: `${ASSET_URL}/solflare.svg`,
  },
];

export const DEFAULT_PROVIDER = WALLET_PROVIDERS[0];

export const WalletContext = createContext({});

export const WalletProvider = ({ children }) => {
  const [selectedProviderUrl, setSelectedProviderUrl] = useState(
    DEFAULT_PROVIDER.url,
  );

  const [wallet, setSelectedWallet] = useState(null);

  const [balances, setBalances] = useState(false);

  const [connected, setConnected] = useState(false);
  const [savedProviderUrl, setSavedProviderUrl] = useLocalStorageState(
    "walletProvider",
    DEFAULT_PROVIDER.url,
  );
  const provider = useMemo(
    () => WALLET_PROVIDERS.find(({ url }) => url === savedProviderUrl),
    [savedProviderUrl],
  );

  const getName = (length = "SHORT") => {
    if (!connected) {
      return "CONNECT WALLET";
    }
    if (length === "SHORT") {
      return (
        wallet.publicKey.toString().substr(0, 6) +
        "..." +
        wallet.publicKey.toString().substr(-5)
      );
    }
  };

  useEffect(() => {
    if (selectedProviderUrl) {
      setSavedProviderUrl(selectedProviderUrl);
    }
  }, [selectedProviderUrl]);

  useEffect(() => {
    if (provider) {
      const updateWallet = () => {
        // hack to also update wallet synchronously in case it disconnects
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const wallet = new (provider?.adapter || Wallet)(savedProviderUrl);

        setSelectedWallet(wallet);
      };

      if (document.readyState !== "complete") {
        // wait to ensure that browser extensions are loaded
        const listener = () => {
          updateWallet();
          window.removeEventListener("load", listener);
        };
        window.addEventListener("load", listener);
        return () => window.removeEventListener("load", listener);
      } else {
        updateWallet();
      }
    }
  }, [provider, savedProviderUrl]);

  useEffect(() => {
    if (!wallet) return;
    wallet.on("connect", () => {
      setConnected(true);
    });
    wallet.on("disconnect", () => {
      setConnected(false);

      console.log("on disconnect");
    });
    return () => {
      if (wallet && wallet.connected) {
        wallet.disconnect();
      }
    };
  }, [wallet]);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connected,
        getName,
        balances,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
