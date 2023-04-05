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
  const [isSale, setIsSale] = useState(false);

  // const [selectedToken, setSelectedToken] = useState();
  // let BNB = "0xae13d989dac2f0debff460ac112a837c89baa7cd";
  // let BUSD = "0xab1a4d4f1d656d2450692d237fdd6c7f9146e814";

  const contractAddress = "0x79ff338CB4599740bC30B266714658Eed00A59aa";
  const bscAddress = "0xaB1a4d4f1D656d2450692D237fdD6C7f9146e814";
  const address = useAddress();

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
    } else {
      setTokenOne(tokens[i]);
    }
    setIsOpen(false);
  }

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
      } catch (error) {
        console.error(error);
      }
    };
    busdBalance();
  }, [address]);

  useEffect(() => {}, [payAbleAmount]);

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

        const ClaimTime = new Date(NextClaimTime * 1000);
        const formattedNextClaimTime = ClaimTime.toLocaleString();
        setNextClaimTime(formattedNextClaimTime);
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
        gasLimit: 51000,
      });

      // setV1("");
      // setV2("");

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

  let tx;

  ///BUYkc
  const BuyKc = async () => {
    setKcLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, routerAbi, signer);
      const __amount = ethers.utils.parseUnits(v1, "ether");

      // const sale = await contract.saleActive();
      // setIsSaleActive(sale);

      let tx; // declare tx outside the if-else block

      if (tokenIn === BUSD) {
        tx = await contract.lockFund(BUSD, __amount, {
          // value: ethers.BigNumber.from(__amount),
          gasLimit: 500000,
          gasPrice: ethers.utils.parseUnits("10.0", "gwei"),
        });
      } else if (tokenIn === BNB) {
        // buy KC with BNB
        tx = await contract.lockFund(BNB, __amount, {
          value: ethers.BigNumber.from(__amount),
          gasLimit: 500000,
          gasPrice: ethers.utils.parseUnits("10.0", "gwei"),
        });
      } else {
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

  //check if Sale is started
  const IsSaleACtive = async () => {
    try {
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let contract = new ethers.Contract(
        MigrationContractAddress,
        MigrationContractAbi,
        provider
      );
      // Check if Sale has started
      const migrationStarted = await contract.saleActive();
      // code to check if Sale started is false
      return migrationStarted;
      // return !saleActive;
    } catch (err) {}
  };

  //CLAIM F(X)
  const handleClaim = async () => {
    setSpinLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, routerAbi, signer);
      // const amount = ethers.utils.parseUnits("0.1", "gwei");

      // Check if the "Next Claim Date" has passed
      const now = new Date();
      const currentDateTime = now.toLocaleString();
      const nextClaimTimestamp = nextClaimTime;
      if (currentDateTime < nextClaimTimestamp) {
        // Disable the button
        setIsNextClaimDate(true);
      } else {
        // Enable the button
        setIsNextClaimDate(false);
      }

      const tx = await contract.claimKingdomCoin({
        gasLimit: 500000,
        gasPrice: ethers.utils.parseUnits("10.0", "gwei"),
      });
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
    setSpinLoading(false);
  };

  return (
    <TransactionContext.Provider
      value={{
        isSale,
        setIsSale,
        IsSaleACtive,
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
