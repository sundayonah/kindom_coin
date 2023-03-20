import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
import "../styles/globals.css";
import { TransactionProvider } from "./components/ReactContext";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChainId = ChainId.BinanceSmartChainTestnet;

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
