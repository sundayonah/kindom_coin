import React, { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import routerAbi from "./contract/routerAbi.json";
import bscAbi from "./contract/bscAbi.json";
import theKingdomAbi from "./contract/theKingdomAbi.json";
import { useAddress } from "@thirdweb-dev/react";
import { Modal, message } from "antd";
import tokens from "./tokenList.json";

export const TransactionContext = createContext({});
export const TransactionProvider = ({ children }) => {
  let BUSD = "0xaB1a4d4f1D656d2450692D237fdD6C7f9146e814";
  let BNB = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
  // let BNB = "0xae13d989dac2f0debff460ac112a837c89baa7cd";

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
  const [expectedLock, setExpectedLock] = useState("");
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
  const [amountInPrice, setAmountInPrice] = useState("");
  // const [getAmountInPrice, setGetAmountInPrice] = useState()

  // const [selectedToken, setSelectedToken] = useState();
  // let BNB = "0xae13d989dac2f0debff460ac112a837c89baa7cd";
  // let BUSD = "0xab1a4d4f1d656d2450692d237fdd6c7f9146e814";

  const contractAddress = "0xd6243011626ac6765Cb398B9Ed7cbEAbE7c5Ee19";
  const newTKContractAddress = "0xe3a85ee627538aE4a16243E5534426866525BB37";
  const bscAddress = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";
  const address = useAddress();

  //message
  const [messageApi, contextHolder] = message.useMessage();

  const [tokenIn, setTokenIn] = useState(BUSD);
  const [payAbleAmount, setPayableAmount] = useState(v1);
  const [busdAmount, setBusdAmount] = useState("");

  const payAmount = "";

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
        const provider = new ethers.getDefaultProvider(
          "https://bsc-dataseed1.binance.org/"
        );
        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        const bnbBalance = await provider.getBalance(address);
        setBnbBalance(
          parseFloat(ethers.utils.formatEther(bnbBalance)).toFixed(5)
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
        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        const provider = new ethers.getDefaultProvider(
          "https://bsc-dataseed1.binance.org/"
        );
        // const signer = provider.getSigner();
        const profile = new ethers.Contract(bscAddress, bscAbi, provider);
        const bal = await profile.balanceOf(address);
        const balance = ethers.utils.formatEther(bal, "ether");
        const etherAmountAsNumber = parseFloat(balance.toString());
        const roundedEtherAmount = etherAmountAsNumber.toFixed(3);
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
    const outputAmount = e.target.value / 0.0114583333;
    setV2(outputAmount);
    if (tokenIn == BNB) {
      const outputAmountInBnb = e.target.value * 28800.00008378182;
      setV2(outputAmountInBnb);
    }
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
        const maxPrice = ethers.utils.formatEther(max, "ether");
        const formattedPrice = parseFloat(maxPrice.toLocaleString());
        // const rounddedkcPrice = formattedPrice.toFixed(6);
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
        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        const provider = new ethers.getDefaultProvider(
          "https://bsc-dataseed1.binance.org/"
        );

        // const signer = provider.getSigner();
        const profile = new ethers.Contract(
          contractAddress,
          routerAbi,
          provider
        );
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
        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        const provider = new ethers.getDefaultProvider(
          "https://bsc-dataseed1.binance.org/"
        );
        // const signer = provider.getSigner();
        const profile = new ethers.Contract(
          contractAddress,
          routerAbi,
          provider
        );
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

  //EXPECTEDLOCKEDFUND
  useEffect(() => {
    const ExpectedTotalLockfund = async () => {
      try {
        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        const provider = new ethers.getDefaultProvider(
          "https://bsc-dataseed1.binance.org/"
        );
        // const signer = provider.getSigner();
        const profile = new ethers.Contract(
          contractAddress,
          routerAbi,
          provider
        );
        const max = await profile.expectedTotalLockFunds();
        const expectedlock = ethers.utils.formatUnits(max, "ether");
        const formattedExpectedLock = expectedlock.toLocaleString();
        setExpectedLock(formattedExpectedLock);
      } catch (error) {
        console.error(error);
      }
    };
    ExpectedTotalLockfund();
  }, []);

  //LOCKEDFUNDS
  useEffect(() => {
    const LockedFunds = async () => {
      try {
        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        const provider = new ethers.getDefaultProvider(
          "https://bsc-dataseed1.binance.org/"
        );
        // const signer = provider.getSigner();
        const profile = new ethers.Contract(
          contractAddress,
          routerAbi,
          provider
        );
        const max = await profile.lockedFunds();
        const fundLock = ethers.utils.formatUnits(max, "ether");
        const formattedLock = parseFloat(fundLock.toString());
        setLockFund(formattedLock.toFixed(2));
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
        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        const provider = new ethers.getDefaultProvider(
          "https://bsc-dataseed1.binance.org/"
        );
        // const signer = provider.getSigner();
        const profile = new ethers.Contract(
          newTKContractAddress,
          theKingdomAbi,
          provider
        );
        const max = await profile.userStorage(address);

        // amount in price = getSumWithdrawableAmount(address) ✅
        // const userStore = userStorage(address) ✅
        // total claim = userStore[0]; ✅
        // next claim amount = amount in price / 4 ✅
        // next claim time = userStore[2] ✅

        //GetAmountInPrice
        const getAmount = await profile.getSumWithdrawableAmount(address);
        const fundLock = ethers.utils.formatUnits(getAmount, "ether");
        const formattedLock = parseFloat(fundLock.toString());
        setAmountInPrice(formattedLock.toFixed(3));

        // TOTAL CLAIM
        const max0 = max[0];
        const TotalClaim = ethers.utils.formatUnits(max0, "ether");
        const formattedTotalClaim = TotalClaim.toLocaleString();
        setTotalClaim(formattedTotalClaim);

        // next claim amount = amount in price / 4
        let priceAmount = amountInPrice / 4;
        setNextClaimAmonut(priceAmount);

        // const max2 = max[2];
        // const AmountInPrice = ethers.utils.formatUnits(max2, "ether");
        // const formattedAmountInPrice = parseFloat(AmountInPrice.toString());
        // setAmountInPrice(formattedAmountInPrice.toFixed());
        // console.log(formattedAmountInPrice, "formattedAmountInPrice");

        // //NEXT CLAIM
        // const max3 = max[3];
        // const NextClaim = ethers.utils.formatUnits(max3, "ether");
        // const formattedNextClaim = parseFloat(NextClaim.toString());
        // setNextClaimAmonut(formattedNextClaim.toFixed());

        const UnixEpoch = "1/1/1970, 1:00:00 AM";

        // NEXT CLAIM TIME
        const max4 = max[2];
        const NextClaimTime = max4;

        //real Claim Time
        const ClaimTime = new Date(NextClaimTime * 1000);
        const formattedNextClaimTime = ClaimTime.toLocaleString();

        //comparing real claim time
        const timeZero = new Date(NextClaimTime * 1000);
        const setTimeToZero = timeZero.toLocaleString();

        //check if formattedNextClaimTime === setTimeToZero
        if (formattedNextClaimTime === setTimeToZero) {
          setNextClaimTime("0");
        } else {
          setNextClaimTime(formattedNextClaimTime);
        }
      } catch (error) {
        console.error(error);
      }
    };
    UserStorage();
  }, [address, amountInPrice]);

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
  // const handleClaim = async () => {
  //   setSpinLoading(true);
  //   try {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();
  //     const contract = new ethers.Contract(contractAddress, routerAbi, signer);
  //     // const amount = ethers.utils.parseUnits("0.1", "gwei");

  //     // Check if the "Next Claim Date" has passed
  //     const now = new Date();
  //     const currentDateTime = now.toLocaleString();
  //     const nextClaimTimestamp = nextClaimTime;

  //     if (currentDateTime < nextClaimTimestamp) {
  //       // Disable the button
  //       setIsNextClaimDate(true);
  //       console.log(isNextClaimDate, "true");
  //     } else {
  //       // Enable the button
  //       setIsNextClaimDate(false);
  //       console.log(isNextClaimDate, "false");
  //     }

  //     const tx = await contract.claimKingdomCoin({
  //       gasLimit: 500000,
  //       gasPrice: ethers.utils.parseUnits("10.0", "gwei"),
  //     });
  //     const receipt = await tx.wait();

  //     //   check if the transaction was successful
  //     if (receipt.status === 1) {
  //       success();
  //       setStatus("success");
  //     } else {
  //       error();
  //       setStatus("error");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     error();
  //     setStatus("error");
  //   }
  //   setSpinLoading(false);
  // };

  //SAMPLE CLAIM F(X)

  const handleClaim = async () => {
    setSpinLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0x973B83eee65fBf059344c9989499F3Edb9f4ADF4",
        routerAbi,
        signer
      );

      const now = new Date();
      const nextClaimTimestamp = new Date(nextClaimTime);

      if (now < nextClaimTimestamp) {
        setIsNextClaimDate(true); // Disable the button
      } else {
        setIsNextClaimDate(false); // Enable the button
        const tx = await contract.claimKingdomCoin({
          gasLimit: 500000,
          gasPrice: ethers.utils.parseUnits("10.0", "gwei"),
        });
        const receipt = await tx.wait();

        if (receipt.status === 1) {
          success();
          setStatus("success");
        } else {
          error();
          setStatus("error");
        }
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
        amountInPrice,
        expectedLock,
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
