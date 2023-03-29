import styles from "../../styles/Home.module.css";
import Image from "next/image";
import Logo from "../components/images/logo.png";

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
