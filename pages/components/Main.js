import { useContract, useContractWrite } from "@thirdweb-dev/react";
import styles from "../../styles/Home.module.css";

const Main = () => {
  const { contract } = useContract(
    "0x7872D3C3Ebc9152daEeC572311E9A51724ff70A5"
  );
  const { mutateAsync, isLoading, error } = useContractWrite(
    contract,
    "deposit"
  );
  console.log(contract);
  return (
    <>
      <div className={styles.main}>
        <div className={styles.modal__body}>
          <form
          //   onSubmit={handleSubmit}
          >
            <label className={styles.inputLabel}>
              <h3>Address</h3>
              <input
                type="text"
                placeholder="Address"
                // value={depositAddress}
                // onChange={handleAddressChange}
              />
            </label>
            <label className={styles.inputLabel}>
              <h3>Amount</h3>
              <input
                // style={{
                // //   border: error ? "1px solid red" : "1px solid #ccc",
                // }}
                type="text"
                placeholder="Amount"
                // value={depositAmount}
                // onChange={handleAmountChange}
              />
              {/* {error && (
                <div style={{ color: "red", fontSize: "10px" }}>
                  Invalid Amount!
                </div>
              )} */}
            </label>
          </form>
        </div>
        <div className={styles.modal__footer}>
          {/* <button onClick={handleCloseModal}>Close</button> */}
          <button
            className={styles.the__modalButton}
            // onClick={() => HandleDeposit()}
          >
            Deposit Fund
          </button>
        </div>
      </div>
    </>
  );
};
export default Main;
