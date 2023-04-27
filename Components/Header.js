// The ConnectWallet component is from the Thirdweb framework and provides a button to connect a wallet.
// It takes in two props: colorMode to set the color of the button and btnTitle to set the text displayed on the button.

import styles from "/styles/Home.module.css";
import Image from "next/image";
import Logo from "/public/logo.png";
import { TransactionContext } from "./TransactionContext";
import { Button, Space } from "antd";

import { ConnectWallet } from "@thirdweb-dev/react";
import { useContext, useState } from "react";

const Header = () => {
  const { connectWallet, currentAccount, subAccount, bnbBalance } =
    useContext(TransactionContext);

  return (
    <div className={styles.connect}>
      <Image src={Logo} alt="kingdom-Coin" width={80} height={80} />
      {/* <button>Connect Wallet</button> */}
      {currentAccount ? (
        <>
          <Button ghost={true}>
            {subAccount} | {bnbBalance}
          </Button>
        </>
      ) : (
        <Button ghost={true} onClick={() => connectWallet()}>
          Connect Wallet
        </Button>
      )}

      {/* <ConnectWallet
        colorMode="white"
        accentColor="transparent" // Ask users to sign in using auth after connecting their wallet
      /> */}
    </div>
  );
};
export default Header;
