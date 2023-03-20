import React, { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import routerAbi from "./contract/routerAbi.json";
import { useAddress } from "@thirdweb-dev/react";

export const TransactionContext = createContext({});
export const TransactionProvider = ({ children }) => {
  const contractAddress = "0x7872D3C3Ebc9152daEeC572311E9A51724ff70A5";
  const address = useAddress();
  console.log(address, "user address ...,.,.,..,..,.,user");
  const handleClick = async () => {
    // setStatus("pending");
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, routerAbi, signer);
      const amount = ethers.utils.parseUnits("0.1", "gwei");
      console.log(amount, "yuyuyuyuyu");

      const tx = await contract.deposit(address, amount, {
        gasLimit: 500000,
        gasPrice: ethers.utils.parseUnits("10.0", "gwei"),
      });

      console.log(address, "Deposit successful!");
      await tx.wait();
      // setStatus("success");
    } catch (err) {
      console.error(err);
      //   setStatus("error");
    }
  };
  return (
    <TransactionContext.Provider
      value={{
        handleClick,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
