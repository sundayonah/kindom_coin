import {
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
  Web3Button,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import routerAbi from "./contract/routerAbi.json";
import { useEffect, useState } from "react";
// import { RiArrowDownSFill } from "react-icons/ri";

export default function MyComponent() {
  const address = useAddress();
  console.log(address, "user address ...,.,.,..,..,.,user");

  const contractAddress = "0x7872D3C3Ebc9152daEeC572311E9A51724ff70A5";

  const [status, setStatus] = useState(false);

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
      setStatus("error");
    }
  };

  const value = ethers.utils.parseUnits("0", "ether");

  return (
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
            <button>
              BUSD
              {/* <RiArrowDownSFill /> */}
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
            <span>KD</span>
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
  );
}
