import { ethers } from "ethers";
import { useState, useContext } from "react";
import { RiArrowDownSFill } from "react-icons/ri";
import Image from "next/image";
import Logo from "../components/images/logo.png";
import { Button, Modal, Popover } from "antd";
import { TransactionContext } from "./ReactContext";
import tokenList from "./tokenList.json";

export default function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(false);

  const { handleClick } = useContext(TransactionContext);

  function openModal(asset) {
    // setChangeToken(asset);
    setIsOpen(true);
  }

  const value = ethers.utils.parseUnits("0", "ether");

  return (
    <>
      <Modal
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
        title="Select a token"
      >
        <div className="modalContent">
          {tokenList.map((e, i) => {
            return (
              <div
                key={i}
                className="tokenChoice"
                // onClick={() => modifyToken(i)}
              >
                <Image
                  src={e.img}
                  alt={e.ticker}
                  width={30}
                  height={30}
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
              <button onClick={() => openModal()}>
                BUSD
                <RiArrowDownSFill />
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
                CLAIM
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
