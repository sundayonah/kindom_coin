import styles from "../../styles/Home.module.css";
import Image from "next/image";
import Logo from "../components/images/logo.png"

import { ConnectWallet } from "@thirdweb-dev/react";

const Header = () => {
  return (
    <div className={styles.connect}>
      <Image src={Logo} alt="kingdon-Coin" width={100} height={100} />
      <ConnectWallet colorMode="dark" btnTitle="Connect Wallet" />
    </div>
  );
};
export default Header; 