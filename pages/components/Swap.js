import { ethers } from "ethers";
import { useState, useContext, useEffect } from "react";
import { RiArrowDownSFill } from "react-icons/ri";
import Image from "next/image";
import Logo from "../components/images/logo.png";
import Bnb from "./images/bnb.png";
import Busd from "./images/busd.png";
import { Modal, message } from "antd";
import { TransactionContext } from "./ReactContext";
import ClipLoader from "react-spinners/ClipLoader";
// import tokenList from "./tokenList.json";

export default function MyComponent() {
  const { handleClick, spinLoading, contextHolder } =
    useContext(TransactionContext);

  const tokens = [
    {
      ticker: "BNB",
      img: "/public/bnb.png",
      name: "bnb Coin",
      address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      decimals: 6,
    },

    {
      ticker: "BUSD",
      img: { Busd },
      name: "busd",
      address: "0x514910771af9ca656af840dff83e8264ecf986ca",
      decimals: 18,
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(false);
  const [tokenOne, setTokenOne] = useState(tokens[0]);
  const [changeToken, setChangeToken] = useState(1);
  const [color, setColor] = useState("#ffffff");

  function openModal(asset) {
    // setChangeToken(asset);
    setIsOpen(true);
  }

  const value = ethers.utils.parseUnits("0", "ether");

  function modifyToken(i) {
    // setPrices(null);
    // setTokenOneAmount(null);
    // setTokenTwoAmount(null);
    if (changeToken === 1) {
      setTokenOne(tokens[i]);
      // fetchPrices(tokens[i].address, tokenTwo.address);
    } else {
      // setTokenTwo(tokens[i]);
      // fetchPrices(tokenOne.address, tokens[i].address);
    }
    setIsOpen(false);
  }

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "#ffff",
  };

  // const [messageApi, contextHolder] = message.useMessage();

  // const success = () => {
  //   messageApi.open({
  //     type: "success",
  //     content: "This is a success message",
  //   });
  // };

  // const error = () => {
  //   messageApi.open({
  //     type: "error",
  //     content: "This is an error message",
  //   });
  // };

  return (
    <>
      {contextHolder}

      <Modal
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
        title="Select a token"
      >
        <div className="modalContent">
          {tokens.map((e, i) => {
            return (
              <div
                key={i}
                className="tokenChoice"
                onClick={() => modifyToken(i)}
              >
                <Image
                  src={Bnb}
                  alt={e.ticker}
                  width={20}
                  height={20}
                  className="tokenLogo"
                />
                <div className="tokenChoiceNames">
                  <div className="tokenName">{e.name}</div>
                  <div className="tokenTicker">{e.ticker}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
      <div className="mainContainer">
        <div className="leftWing">
          {/* <Image src={Bnb} width={15} hieght={15} alt="bnb" />
          <Image src={Busd} width={15} hieght={15} alt="bnb" /> */}
          <h4>Buy King</h4>
          <p>1 BNB = 1KD</p>
          <p>Min = 1</p>
          <p>Max = 1</p>
          <p>Total Deposit = 1</p>
          <hr />

          <div className="formInput">
            <div className="youPay">
              <h4>You Pay</h4>
              <h4>Bal: 900</h4>
            </div>
            <div className="input">
              <input placeholder="0.0" />
              <button>MAX</button>
              <button className="assetOne" onClick={() => openModal(1)}>
                <Image
                  className="assetLogo"
                  src={Bnb}
                  width={20}
                  height={20}
                  alt="Logo"
                />
                {tokenOne.ticker}
              </button>
            </div>
            <div className="youPay exchange">
              <h4>Exchange Rate</h4>
              <h4>0.1 BUSD per KD</h4>
            </div>
            <div className="youPay">
              <h4>You get</h4>
            </div>
            <div className="input">
              <input placeholder="0.0" />
              <span>
                <Image src={Logo} alt="kingdon-Coin" width={30} height={25} />
                KC
              </span>
            </div>
          </div>
        </div>
        <div className="rightWing">
          <div className="totalClaim">
            <h4>Kingdom Coin Claim</h4>
            <p>Total Claim = 1KD</p>
            <p>Next Claim: 12/12/12</p>
            <p>Next Claim Time: 12/12/12</p>
            <div className="claimButton">
              <button className="claim" onClick={() => handleClick()}>
                {spinLoading ? (
                  <div className="spinnerbtn">
                    <ClipLoader
                      color={color}
                      cssOverride={override}
                      loading={spinLoading}
                      size={20}
                    />
                    {/* <p>Approve...</p> */}
                  </div>
                ) : (
                  "CLAIM"
                )}
              </button>
            </div>
          </div>
          <div className="aboutKingdom">
            <h1>ABOUT KINGDOM COIN</h1>
          </div>
        </div>
      </div>
    </>
  );
}
