import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "@rainbow-me/rainbowkit/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  RainbowKitProvider,
  connectorsForWallets,
  wallet,
} from "@rainbow-me/rainbowkit";

import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const bscChain = {
  id: 56,
  name: "Binance Smart Chain",
  network: "Binance Smart Chain",
  iconUrl:
    "https://seeklogo.com/images/B/binance-coin-bnb-logo-97F9D55608-seeklogo.com.png",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "BSC",
    symbol: "BNB",
  },
  rpcUrls: {
    default: "https://bsc-dataseed1.binance.org/",
  },
  blockExplorers: {
    default: { name: "BSC Mainnet", url: "https://bscscan.com/" },
    mainn: { name: "BSC Mainnet", url: "https://bscscan.com/" },
  },
  testnet: false,
};

const bscTestnetChain = {
  id: 97,
  name: "BSC Tesnet",
  network: "BSC Testnet",
  iconUrl:
    "https://seeklogo.com/images/B/binance-coin-bnb-logo-97F9D55608-seeklogo.com.png",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "BSC",
    symbol: "BNB",
  },
  rpcUrls: {
    default: "https://data-seed-prebsc-1-s1.binance.org:8545",
  },
  blockExplorers: {
    default: {
      name: "BSC Testnet",
      url: "https://explorer.binance.org/smart-testnet",
    },
    mainn: {
      name: "BSC Testnet",
      url: "https://explorer.binance.org/smart-testnet",
    },
  },
  testnet: true,
};

const goerli = {
  id: 5,
  name: "Goerli Test Network",
  network: "Goerli Test Network",
  iconUrl:
    "https://upload.wikimedia.org/wikipedia/commons/6/6f/Ethereum-icon-purple.svg",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "Goerli",
    symbol: "GoerliETH",
  },
  rpcUrls: {
    default: "https://eth-goerli.g.alchemy.com/v2/lBCPiX-iVXmK6pE7YHG3076Jhvxgh6NC",
  },
  blockExplorers: {
    default: {
      name: "Goerli Test Network",
      url: "https://goerli.etherscan.io",
    },
    mainn: {
      name: "Goerli Test Network",
      url: "https://goerli.etherscan.io",
    },
  },
  testnet: true,
};






const { provider, chains } = configureChains(
  [bscChain],
  [jsonRpcProvider({ rpc: (chain) => ({ http: chain.rpcUrls.default }) })]
);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      wallet.metaMask({ chains }),
      wallet.trust({ chains }),
      wallet.walletConnect({ chains }),
    ],
  },
  {
    groupName: "Others",
    wallets: [wallet.coinbase({ chains, appName: "My RainbowKit App" })],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider modalSize="compact" chains={chains}>
      <App />
    </RainbowKitProvider>
  </WagmiConfig>
);

reportWebVitals();
