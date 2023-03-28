import React, { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import routerAbi from "./contract/routerAbi.json";
import bscAbi from "./contract/bscAbi.json";
import { useAddress } from "@thirdweb-dev/react";
import { Modal, message } from "antd";
import tokens from "./tokenList.json";

export const TransactionContext = createContext({});
export const TransactionProvider = ({ children }) => {
  let BUSD = "0xaB1a4d4f1D656d2450692D237fdD6C7f9146e814";
  let BNB = "0xae13d989dac2f0debff460ac112a837c89baa7cd";

  const [changeToken, setChangeToken] = useState(BUSD);
  const [tokenOne, setTokenOne] = useState(tokens[0]);
  const [tokenTwo, setTokenTwo] = useState(tokens[1]);

  const [spinLoading, setSpinLoading] = useState(false);
  const [status, setStatus] = useState(false);
  const [v1, setV1] = useState("");
  const [v2, setV2] = useState("");
  const [outputAmount, setOutputAmount] = useState("");
  const [kcPrice, setKcPrice] = useState("");
  const [minLock, setMinLock] = useState("");
  const [maxLock, setMaxLock] = useState("");
  const [lockFund, setLockFund] = useState("");
  const [totalClaim, setTotalClaim] = useState("");
  const [nextClaimAmount, setNextClaimAmonut] = useState("");
  const [nextClaimTime, setNextClaimTime] = useState("");
  const [isApproved, setIsApproved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [kcLoading, setKcLoading] = useState(false);
  const [switchButton, setSwitchButton] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isNextClaimDate, setIsNextClaimDate] = useState(false);
  const [bnbBalance, setBnbBalance] = useState("");
  const [busdBalance, setBusdBalance] = useState("");

  // const [selectedToken, setSelectedToken] = useState();
  // let BNB = "0xae13d989dac2f0debff460ac112a837c89baa7cd";
  // let BUSD = "0xab1a4d4f1d656d2450692d237fdd6c7f9146e814";

  const contractAddress = "0x79ff338CB4599740bC30B266714658Eed00A59aa";
  const bscAddress = "0xaB1a4d4f1D656d2450692D237fdD6C7f9146e814";
  const address = useAddress();
  // console.log(address, "user address ...,.,.,..,..,.,user");

  //message
  const [messageApi, contextHolder] = message.useMessage();

  const [tokenIn, setTokenIn] = useState(BUSD);
  const [payAbleAmount, setPayableAmount] = useState(v1);
  const [busdAmount, setBusdAmount] = useState("");

  async function modifyToken(token, i) {
    if (token.name === "bnb") {
      setTokenIn(BNB);
      setPayableAmount(v1);
      setChangeToken(BNB); // update changeToken for BNB
    } else {
      setTokenIn(BUSD);
      setBusdAmount(v1);
      setChangeToken(BUSD); // update changeToken for BUSD
    }

    if (changeToken === 1) {
      setTokenTwo(tokens[i]);
      console.log("yes");
    } else {
      setTokenOne(tokens[i]);
      console.log("no");
    }
    setIsOpen(false);
  }

  // const valueAmount = v1 && ethers.utils.parseUnits(v1.toString(), "ether");
  // console.log(valueAmount, "valueAmountvalueAmountvalueAmount");

  // function modifyToken(token) {
  //   // if (token.name === "bnb") {
  //   setTokenIn(BNB);
  //   setPayableAmount(v1);
  //   // } else {
  //   //   setTokenIn(BUSD);
  //   //   setBusdAmount(v1);
  //   // }
  //   setIsOpen(false);
  // }

  // async function modifyToken(token, i) {
  //   if (token.name == "bnb") {
  //     setTokenIn(BNB);
  //     setPayableAmount(v1);
  //     // setPayableAmount(ethers.utils.parseUnits(v1.toString(), "ether"));
  //     console.log(BNB, "bnb ....");
  //   } else {
  //     setTokenIn(BUSD);
  //     setBusdAmount(v1);
  //     console.log(BUSD, "busd ....");

  //     // setBusdAmount(ethers.utils.parseUnits(v1, "ether"));
  //     // (ethers.utils.parseUnits(v1, "ether")); // (v1 * 10 ** 18).toString()
  //   }
  //   if (changeToken === BNB) {
  //     setTokenOne(tokens[i]);
  //     console.log("yes");
  //   } else {
  //     setTokenTwo(tokens[i]);
  //     setBusdAmount(v1);

  //     console.log("no");
  //   }
  //   setIsOpen(false);
  // }

  //success f(x)
  const success = () => {
    messageApi.open({
      type: "success",
      content: "Transaction Successfull",
    });
  };

  //error f(x)
  const error = () => {
    messageApi.open({
      type: "error",
      content: "Transaction not Successfull",
    });
  };

  //GET BALANCE IN BNB
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const bnbBalance = await provider.getBalance(address);
        setBnbBalance(
          parseFloat(ethers.utils.formatEther(bnbBalance)).toFixed(3)
        );
      } catch (error) {
        console.error(error);
      }
    };
    if (address) {
      fetchBalance();
    }
  }, [address]);

  //GET BALLANCE IN BUSD
  useEffect(() => {
    const busdBalance = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const profile = new ethers.Contract(bscAddress, bscAbi, signer);
        const bal = await profile.balanceOf(address);
        const balance = ethers.utils.formatEther(bal, "ether");
        const etherAmountAsNumber = parseFloat(balance.toString());
        const roundedEtherAmount = etherAmountAsNumber.toFixed();
        setBusdBalance(roundedEtherAmount);
        console.log(roundedEtherAmount, "format acc in BUSD");
      } catch (error) {
        console.error(error);
      }
    };
    busdBalance();
  }, [address]);

  useEffect(() => {
    console.log(payAbleAmount.toString(), "payable amount changed");
  }, [payAbleAmount]);

  const handleMaxChange = async (e) => {
    setV1(e);
    setV2(e);
  };
  //working
  const handleV1Change = async (e) => {
    setV1(e.target.value);
    // const value = ethers.utils.parseUnits(e.target.value.toString(), "ether");
    const outputAmount = e.target.value * 0.065;
    setV2(outputAmount);
  };

  // function handleV1Change(event) {
  //   const inputValue = event.target.value;
  //   setV1(inputValue);
  // }

  //BNB TO KC
  useEffect(() => {
    const Price = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const profile = new ethers.Contract(contractAddress, routerAbi, signer);
        const max = await profile.price();
        const maxPrice = ethers.utils.formatUnits(max, "ether");
        const formattedPrice = maxPrice.toLocaleString();
        setKcPrice(formattedPrice);
        // console.log(formattedPrice, "price price");
      } catch (error) {
        console.error(error);
      }
    };

    Price();
  }, []);

  //MINLOCKFOREACHUSER
  useEffect(() => {
    const MinLockForEachUser = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const profile = new ethers.Contract(contractAddress, routerAbi, signer);
        const max = await profile.minLockForEachUser();
        const minlock = ethers.utils.formatUnits(max, "ether");
        const formattedMinLock = minlock.toLocaleString();
        setMinLock(formattedMinLock);
        // console.log(formattedMinLock, "formattedMinLock formattedMinLock");
      } catch (error) {
        console.error(error);
      }
    };

    MinLockForEachUser();
  }, []);

  //MAXLOCKFOREACHUSER
  useEffect(() => {
    const MaxLockForEachUser = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const profile = new ethers.Contract(contractAddress, routerAbi, signer);
        const max = await profile.maxLockForEachUser();
        const maxlock = ethers.utils.formatUnits(max, "ether");
        const formattedMaxLock = maxlock.toLocaleString();
        setMaxLock(formattedMaxLock);
        // console.log(formattedMaxLock, "formattedMaxLock formattedMaxLock");
      } catch (error) {
        console.error(error);
      }
    };
    MaxLockForEachUser();
  }, []);

  //LOCKEDFUNDS
  useEffect(() => {
    const LockedFunds = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const profile = new ethers.Contract(contractAddress, routerAbi, signer);
        const max = await profile.lockedFunds();
        const fundLock = ethers.utils.formatUnits(max, "ether");
        const formattedLock = fundLock.toLocaleString();
        setLockFund(formattedLock);
        // console.log(formattedLock, "formattedLock formattedLock");
      } catch (error) {
        console.error(error);
      }
    };
    LockedFunds();
  }, []);

  //USERSTORAGE
  useEffect(() => {
    const UserStorage = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const profile = new ethers.Contract(contractAddress, routerAbi, signer);
        const max = await profile.userStorage(address);

        //TOTAL CLAIM
        const max0 = max[0];
        const TotalClaim = ethers.utils.formatUnits(max0, "ether");
        const formattedTotalClaim = TotalClaim.toLocaleString();
        setTotalClaim(formattedTotalClaim);

        //NEXT CLAIM
        const max1 = max[3];
        const NextClaim = ethers.utils.formatUnits(max1, "ether");
        const formattedNextClaim = NextClaim.toLocaleString();
        setNextClaimAmonut(formattedNextClaim);

        //NEXT CLAIM TIME
        const max2 = max[4];
        const NextClaimTime = max2;
        // console.log(max, max2, "formattedNextClaim");

        const ClaimTime = new Date(NextClaimTime * 1000);
        const formattedNextClaimTime = ClaimTime.toLocaleString();
        setNextClaimTime(formattedNextClaimTime);
        // console.log(formattedNextClaimTime, "formattedNextClaimTime");
      } catch (error) {
        console.error(error);
      }
    };
    UserStorage();
  }, [address]);

  //Approve f(x)
  const Approved = async () => {
    setIsLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const profile = new ethers.Contract(bscAddress, bscAbi, signer);
      const value = ethers.utils.parseUnits(v1, "ether");
      const tx = await profile.approve(contractAddress, value, {
        gasLimit: 61000,
      });

      // setV1("");
      // setV2("");
      console.log(tx, "TRANSACTION");

      const receipt = await tx.wait();

      //   check if the transaction was successful
      if (receipt.status === 1) {
        setSwitchButton(false);
        success();
        setStatus("success");

        //   // Set tokenIn state variable to BUSD if it is not already set
      } else {
        error();
        setStatus("error");
      }
      setIsApproved(true);
      // setCongrat(true);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
    // setTokenIn(bscAddress);
    // setBusdAmount(v1);
  };

  // console.log(tokens,"tokens tokens")

  let tx;

  ///BUYkc
  const BuyKc = async () => {
    setKcLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, routerAbi, signer);
      const __amount = ethers.utils.parseUnits(v1, "ether");

      console.log(busdAmount * 10 ** 18, "busdAmount");
      console.log(tokenIn, "tokenIn");
      console.log("payAbleAmount", payAbleAmount);
      console.log("v1 v1 v1", v1);

      let tx; // declare tx outside the if-else block

      if (tokenIn === BUSD) {
        console.log("Buying with BUSD...");
        tx = await contract.lockFund(BUSD, __amount, {
          // value: ethers.BigNumber.from(__amount),
          gasLimit: 500000,
          gasPrice: ethers.utils.parseUnits("10.0", "gwei"),
        });
      } else if (tokenIn === BNB) {
        console.log("Buying with BNB...");
        // buy KC with BNB
        tx = await contract.lockFund(BNB, __amount, {
          value: ethers.BigNumber.from(__amount),
          gasLimit: 500000,
          gasPrice: ethers.utils.parseUnits("10.0", "gwei"),
        });
      } else {
        console.error("Invalid token address!");
        return;
      }

      setV1("");
      setV2("");
      setSwitchButton(false);

      const receipt = await tx.wait();

      //   check if the transaction was successful
      if (receipt.status === 1) {
        success();
        setStatus("success");
      } else {
        error();
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      error();
      setStatus("error");
    }
    setKcLoading(false);
  };

  //CLAIM F(X)
  const handleClaim = async () => {
    setSpinLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, routerAbi, signer);
      // const amount = ethers.utils.parseUnits("0.1", "gwei");

      // // Check if the "Next Claim Date" has passed
      const now = new Date();
      const currentDateTime = now.toLocaleString();
      const nextClaimTimestamp = nextClaimTime;
      if (currentDateTime < nextClaimTimestamp) {
        // Disable the button
        setIsNextClaimDate(true);
        console.log("Next claim date has not yet passed, button disabled.");
      } else {
        // Enable the button
        setIsNextClaimDate(false);
        console.log("you can claim now .");
      }
      console.log(nextClaimTimestamp, "nextClaimTimestampnextClaimTimestamp");

      const tx = await contract.claimKingdomCoin({
        gasLimit: 500000,
        gasPrice: ethers.utils.parseUnits("10.0", "gwei"),
      });
      // console.log(address, "Deposit successful!");
      const receipt = await tx.wait();

      //   check if the transaction was successful
      if (receipt.status === 1) {
        success();
        setStatus("success");
      } else {
        error();
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setSpinLoading(false);
      error();
      setStatus("error");
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        setChangeToken,
        busdBalance,
        bnbBalance,
        modifyToken,
        isNextClaimDate,
        address,
        tokenOne,
        isOpen,
        setIsOpen,
        BuyKc,
        switchButton,
        kcLoading,
        isLoading,
        isApproved,
        Approved,
        nextClaimTime,
        nextClaimAmount,
        totalClaim,
        lockFund,
        maxLock,
        minLock,
        kcPrice,
        v1,
        v2,
        handleV1Change,
        handleMaxChange,
        contextHolder,
        handleClaim,
        spinLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
