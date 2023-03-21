import React, { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import routerAbi from "./contract/routerAbi.json";
import { useAddress } from "@thirdweb-dev/react";
import { Modal, message } from "antd";

export const TransactionContext = createContext({});
export const TransactionProvider = ({ children }) => {
  const [spinLoading, setSpinLoading] = useState(false);
  const [status, setStatus] = useState(false);

  const contractAddress = "0x7872D3C3Ebc9152daEeC572311E9A51724ff70A5";
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

  //CLAIM F(X)
  const handleClick = async () => {
    setSpinLoading(true);
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
        contextHolder,
        handleClick,
        spinLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
