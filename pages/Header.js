import styles from "../styles/Home.module.css";

import { ConnectWallet } from "@thirdweb-dev/react";

const Header = () => {
  return (
    <div className={styles.connect}>
      <ConnectWallet colorMode="dark" btnTitle="Connect Wallet" />
    </div>
  );
};
export default Header;
