// The ConnectWallet component is from the Thirdweb framework and provides a button to connect a wallet.
// It takes in two props: colorMode to set the color of the button and btnTitle to set the text displayed on the button.

import styles from "/styles/Home.module.css";
import Image from "next/image";
import Logo from "/public/logo.png";

import { ConnectWallet } from "@thirdweb-dev/react";




const Header = () => {
  return (
    <div className={styles.connect}>
      <Image src={Logo} alt="kingdom-Coin" width={80} height={80} />
      <ConnectWallet colorMode="#daa851" btnTitle="Connect Wallet" />
    </div>
  );
};
export default Header;
