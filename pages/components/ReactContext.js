import React, { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import routerAbi from "./contract/routerAbi.json";
import { useAddress } from "@thirdweb-dev/react";
import { Modal, message } from "antd";

export const TransactionContext = createContext({});
export const TransactionProvider = ({ children }) => {
  const [spinLoading, setSpinLoading] = useState(false);
  const [status, setStatus] = useState(false);
  const [v1, setV1] = useState("");
  const [v2, setV2] = useState("");
  const [kcPrice, setKcPrice] = useState("");
  const [minLock, setMinLock] = useState("");
  const [maxLock, setMaxLock] = useState("");
  const [lockFund, setLockFund] = useState("");
  const [totalClaim, setTotalClaim] = useState("");
  const [nextClaimAmount, setNextClaimAmonut] = useState("");
  const [nectClaimTime, setNextClaimTime] = useState("");

  const contractAddress = "0x0Fd0ECF9ca6b82591850353e2E94F37EbDd21947";
  const address = useAddress();
  console.log(address, "user address ...,.,.,..,..,.,user");

  //message
  const [messageApi, contextHolder] = message.useMessage();

  //success f(x)
  const success = () => {
    messageApi.open({
      type: "success",
      content: "This is a success message",
    });
  };

  //error f(x)
  const error = () => {
    messageApi.open({
      type: "error",
      content: "This is an error message",
    });
  };

  const handleMaxChange = async (e) => {
    setV1(e);
    setV2(e);
  };
  const handleV1Change = async (e) => {
    setV1(e.target.value);
    setV2(e.target.value);
  };

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

        const nexClaimTime = new Date(NextClaimTime * 1000);
        const formattedNextClaimTime = nexClaimTime.toLocaleString();
        setNextClaimTime(formattedNextClaimTime);
      } catch (error) {
        console.error(error);
      }
    };
    UserStorage();
  }, [address]);

  //CLAIM F(X)
  const handleClaim = async () => {
    setSpinLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, routerAbi, signer);
      // const amount = ethers.utils.parseUnits("0.1", "gwei");

      const tx = await contract.claimKingdomCoin({
        gasLimit: 500000,
        gasPrice: ethers.utils.parseUnits("10.0", "gwei"),
      });

      console.log(address, "Deposit successful!");
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
        nectClaimTime,
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
