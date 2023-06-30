// This is a code snippet in JavaScript for initializing a decentralized application (dApp) using the Thirdweb framework.

// The import statements at the top of the code are importing the necessary modules from the Thirdweb framework and the local stylesheet.

import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
import "../styles/globals.css";
import { TransactionProvider } from "../Components/TransactionContext";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChainId = ChainId.BinanceSmartChainMainnet;

function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider activeChain={activeChainId}>
      <TransactionProvider>
        <Component {...pageProps} />
      </TransactionProvider>
    </ThirdwebProvider>
  );
}
export default MyApp;
