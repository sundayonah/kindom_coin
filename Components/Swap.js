import { ethers } from "ethers";
import { useState, useContext, useEffect } from "react";
import { RiArrowDownSFill } from "react-icons/ri";
import Image from "next/image";
import Logo from "/public/logo.png";
import Bnb from "/public/bnb.png";
import Busd from "/public/busd.png";
import { Modal, message } from "antd";
import { TransactionContext } from "./TransactionContext";
import ClipLoader from "react-spinners/ClipLoader";
import ScaleLoader from "react-spinners/ScaleLoader";
import routerAbi from "./contract/routerAbi.json";
import tokens from "./tokenList.json";

export default function MyComponent() {
  const {
    amountInPrice,
    expectedLock,
    isSale,
    setIsSale,
    handleClaim,
    spinLoading,
    contextHolder,
    v1,
    v2,
    handleMaxChange,
    handleV1Change,
    kcPrice,
    minLock,
    maxLock,
    lockFund,
    totalClaim,
    nextClaimAmount,
    nextClaimTime,
    isApproved,
    Approved,
    isLoading,
    switchButton,
    BuyKc,
    address,
    modifyToken,
    isOpen,
    setIsOpen,
    isNextClaimDate,
    tokenOne,
    kcLoading,
    bnbBalance,
    busdBalance,
    setChangeToken,
    IsSaleACtive,
  } = useContext(TransactionContext);

  // const tokens = [
  //   {
  //     ticker: "BNB",
  //     img: "/images/bnb.png",
  //     name: "bnb",
  //     address: "0x0000000000000000000000000000000000000000",
  //   },

  //   {
  //     ticker: "BUSD",
  //     img: "/images/busd.png",
  //     name: "busd",
  //     address: "0xab1a4d4f1d656d2450692d237fdd6c7f9146e814",
  //   },
  // ];

  const [check, setCheck] = useState(false);
  const [color, setColor] = useState("#ffffff");

  function openModal(asset) {
    // setChangeToken(asset);
    setIsOpen(true);
  }
  const value = ethers.utils.parseUnits("0", "ether");

  const contractAddress = "0x0Fd0ECF9ca6b82591850353e2E94F37EbDd21947";

  // function modifyToken(token, i) {
  //   if (token.name == "bnb") {
  //     console.log(token.address, "BNB");
  //   } else {
  //     console.log(token.address, "BUSD");
  //   }
  //   if (changeToken === 1) {
  //     setTokenOne(tokens[i]);
  //   } else {
  //     setTokenTwo(tokens[i]);
  //   }
  //   setIsOpen(false);
  // }

  // if ((selectedToken = BNB)) {
  //   tokenIn = BNB;
  //   payAbleAmount(e.target.value);
  // } else {
  //   tokenIn = BUSD;
  //   payAbleAmount = 0;
  //   BUSD = BusdAmount; //where is this comming from
  // }

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "#ffff",
  };
  const overrideScale = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };
  const percentage = (lockFund / expectedLock) * 100;
  const progressStyle = { width: `${percentage}%` };

  const tkc = "TKC";

  return (
    <>
      {contextHolder}

      <Modal
        open={isSale}
        footer={null}
        onCancel={() => setIsSale(false)}
        title="Notice"
        // set background color here
      >
        <div className="modalContent">
          <p>Sale Has Ended.</p>
        </div>
      </Modal>

      <Modal
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
        title="Select a token"
      >
        <div className="modalContent">
          {tokens.map((e, i) => {
            // console.log(e.img, "img");
            return (
              <div
                key={i}
                className="tokenChoice"
                onClick={() => modifyToken(e, i)}
              >
                {/* // inside the render method or in the map function */}
                <Image
                  src={e.name === "busd" ? Bnb : Busd}
                  alt={e.ticker}
                  width={20}
                  height={20}
                  className="tokenLogo"
                />
                <div className="tokenChoiceNames">
                  <div className="tokenName">{e.name}</div>
                  <div className="tokenTicker">{e.ticker}</div>
                  {/* <div className="tokenTicker">{e.address1}</div> */}
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
          <h4>Buy Kingdom Coin</h4>
          <div className="contentForText">
            <p>1 BUSD </p>
            <strong>
              &nbsp;{kcPrice} {tkc}
            </strong>
          </div>
          <div className="contentForText">
            <p>Min</p>
            <strong>&nbsp;{minLock}</strong>
          </div>
          <div className="contentForText">
            <p>Max</p>
            <strong>&nbsp;{maxLock}</strong>
          </div>
          <div className="contentForText">
            <p>Total Locked</p>
            <strong>&nbsp;{lockFund}</strong>
          </div>
          {/* <hr /> */}

          <div className="formInput">
            <div className="youPay">
              <h4>Bal:</h4>
              <h4>{tokenOne.name === "busd" ? busdBalance : bnbBalance}</h4>
            </div>
            <div className="inputOut">
              <input
                type="text"
                placeholder="0.0"
                value={v1}
                onChange={handleV1Change}
              />
              <button
                className={`button ${!address ? "disAble" : "enable"}`}
                disabled={!address}
                onClick={() =>
                  handleMaxChange(
                    tokenOne.ticker === "BUSD" ? busdBalance : bnbBalance
                  )
                }
              >
                MAX
                {/* {address ? "MAX" : "CONNECT WALLET"} */}
              </button>
              <button className="assetOne" onClick={() => openModal()}>
                {/* Select Token */}
                {tokenOne.ticker}
                <RiArrowDownSFill />
              </button>
            </div>
            {/* <div className="youPay exchange">
              <h4>Exchange Rate</h4>
              <h4>0.1 BUSD per KD</h4>
            </div> */}
            <div className="youPay">
              <h4>You get</h4>
            </div>
            <div className="inputOut">
              <input readOnly placeholder="0.0" value={v2} />
              <span>
                <Image src={Logo} alt="kingdon-Coin" width={30} height={25} />
                {tkc}
              </span>
            </div>
          </div>
          <div className="claimButton">
            {switchButton && tokenOne.name !== "bnb" ? (
              <button className="claim buy" onClick={() => Approved()}>
                {isLoading ? (
                  <div className="spinnerbtn">
                    <ScaleLoader
                      color={color}
                      cssOverride={overrideScale}
                      loading={isLoading}
                      size={15}
                      speedMultiplier={0.9}
                    />
                    {/* <p>Approve...</p> */}
                  </div>
                ) : (
                  "Approved"
                )}
              </button>
            ) : (
              <button
                className="claim buy"
                // onClick={async () => {
                //   if (await IsSaleACtive()) {
                //     setIsSale(true);
                //   } else {
                //     BuyKc();
                //   }
                // }}
                title={isNextClaimDate ? "Presail Close." : ""}
                disabled={kcLoading} // Add the disabled attribute based on kcLoading state
              >
                {kcLoading ? (
                  <div className="spinnerbtn">
                    <ScaleLoader
                      color={color}
                      cssOverride={overrideScale}
                      loading={!kcLoading}
                      // disable kcLoading and comment buyKc function
                      size={15}
                      speedMultiplier={0.9}
                    />
                    {/* <p>Approve...</p> */}
                  </div>
                ) : (
                  "Buy KC"
                )}
              </button>
            )}
          </div>
        </div>

        <div className="rightWing">
          <div className="totalClaim">
            <h4>Kingdom Coin Claim</h4>
            <div className="contentForText">
              <p>Amount In Price</p>
              <strong>
                {amountInPrice} {tkc}
              </strong>
            </div>
            <div className="contentForText">
              <p>Total Claim</p>
              <strong>
                {totalClaim} {tkc}
              </strong>
            </div>
            <div className="contentForText">
              <p>Next Claim Amount</p>
              <strong> {nextClaimAmount}</strong>
            </div>
            <div className="contentForText">
              <p>Next Claim Time</p>
              <strong> {nextClaimTime}</strong>
            </div>
            <div className="claimButton">
              {/* <button
                onClick={() => handleClaim()}
                className={isNextClaimDate ? "disAble" : "claim"}
                // disabled={isNextClaimDate}
              >
                {spinLoading ? (
                  <div className="spinnerbtn">
                    <ScaleLoader
                      color={color}
                      cssOverride={override}
                      loading={spinLoading}
                      size={15}
                    />
                  </div>
                ) : (
                  "CLAIM"
                )}
              </button> */}
              <button
                onClick={() => handleClaim()}
                className={isNextClaimDate ? "disAble" : "claim"}
                disabled={spinLoading || isNextClaimDate}
                title={isNextClaimDate ? "Claim start after private sale." : ""}
              >
                {spinLoading ? (
                  <div className="spinnerbtn">
                    <ScaleLoader
                      color={color}
                      cssOverride={override}
                      loading={spinLoading}
                      size={15}
                    />
                  </div>
                ) : (
                  "CLAIM"
                )}
              </button>
            </div>
          </div>
          <div>
            <div className="progress">
              <p>
                Lock Fund: $<small>{lockFund}</small>
              </p>
              <p>
                Expected Lock: $<small>{expectedLock}</small>
              </p>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={progressStyle}>
                <span className="progress-bar-text">{`${
                  isNaN(percentage) ? 0 : percentage.toFixed(2)
                }%`}</span>
              </div>
            </div>
          </div>
          {/* <div className="aboutKingdom">
            <h1>ABOUT KINGDOM COIN</h1>
          </div> */}
        </div>
      </div>
    </>
  );
}
