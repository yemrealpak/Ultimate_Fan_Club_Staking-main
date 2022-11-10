import React, { useState, useEffect, useCallback, useDebugValue } from "react";
import "./index.css";
import {
  useAccount,
  useContractRead,
  useContractReads,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  erc20ABI,
} from "wagmi";
import {
  TokenAddress,
  StakingABI,
  StakingAddress,
} from "../../contracts/contracts.js";

import moment from "moment";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import CountUp from "react-countup";

import { ethers, BigNumber } from "ethers";
import { useNetwork } from "wagmi";

function Transaction() {
  const { address } = useAccount();

  const { chain } = useNetwork();
  const chainRpcUrl = chain?.rpcUrls?.default;

  {
    /* modal*/
  }
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const [transactionData, setTransactionData] = useState();
  const test = [];

  const stakingContractAddress = StakingAddress();

  const [userTotalStakeAmount, setUserTotalStakeAmount] = useState(0);

  const getUserTotalStakeAmount = async () => {
    const provider = new ethers.providers.StaticJsonRpcProvider(
      chainRpcUrl === undefined
        ? "https://data-seed-prebsc-1-s1.binance.org:8545"
        : chainRpcUrl
    );

    const contract = new ethers.Contract(
      stakingContractAddress,
      StakingABI,
      provider
    );

    const currentAddress =
      address !== undefined
        ? address
        : "0x0000000000000000000000000000000000000000";
    try {
      const contractTx = await contract.getUserTotalStakedAmount(currentAddress);
      setUserTotalStakeAmount(BigNumber.from(contractTx).toString());
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!show) {
      const interval = setInterval(() => {
        getUserTotalStakeAmount();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [show, address, chainRpcUrl]);

  console.log(address,"address");

  const { data, refetch } = useContractRead({
    addressOrName: stakingContractAddress,
    contractInterface: StakingABI,
    functionName: "getAllUserInfo",
    args: [address],
  });

  useEffect(() => {
    setTransactionData(data);
  }, [data, transactionData, test]);

  useEffect(() => {
    if (!show) {
      const interval = setInterval(() => {
        refetch();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [show]);

  const length = transactionData && parseInt(transactionData.length) / 7;
  for (let i = 0; i < length; i++) {
    test.push(transactionData.slice(i * 7, (i + 1) * 7));
  }

  const HandleClaim = (id) => {
    const { config } = usePrepareContractWrite({
      addressOrName: stakingContractAddress,
      contractInterface: StakingABI,
      functionName: "withdraw",
      args: [id.id],
    });

    const { write, data } = useContractWrite(config);

    const { isLoading } = useWaitForTransaction({
      hash: data?.hash,
      wait: data?.wait,

      onSuccess(data) {
        refetch();
        toast.success("Claim Successful", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(function () {
          window.location.reload(1);
        }, 2000);
      },
      onError(error) {
        toast.error("Claim Failed", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      },
    });

    return (
      <>
        <button
          size="sm"
          className="transactions-claim-btn"
          onClick={() => write()}
        >
          Claim{" "}
          {isLoading && (
            <i
              style={{ marginLeft: "3px", marginTop: "3px" }}
              className="fa fa-spinner fa-spin"
            ></i>
          )}
        </button>
        <button className="claim-button-mobile" onClick={() => write()}>
          Claim{" "}
          {isLoading && (
            <i
              style={{ marginLeft: "3px", marginTop: "3px" }}
              className="fa fa-spinner fa-spin"
            ></i>
          )}
        </button>
      </>
    );
  };

  const HandleCancel = () => {
    const { config } = usePrepareContractWrite({
      addressOrName: stakingContractAddress,
      contractInterface: StakingABI,
      functionName: "emergencyWithdraw",
      args: [currentId],
    });
    const { write, data, isError, isSuccess } = useContractWrite(config);

    const { isLoading } = useWaitForTransaction({
      hash: data?.hash,
      wait: data?.wait,
      onSuccess(data) {
        data && handleClose();
        refetch();
        toast.success("Emergency Withdraw Successfull", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // setTimeout(function () {
        //   window.location.reload(1);
        // },3000)
      },
      onError(error) {
        handleClose();
        toast.error("Emergency Withdraw Error", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      },
    });

    return (
      <button
        size="sm"
        className="transactions-submit-btn"
        onClick={() => write()}
      >
        Submit{" "}
        {isLoading && (
          <i
            style={{ marginLeft: "3px", marginTop: "3px" }}
            className="fa fa-spinner fa-spin"
          ></i>
        )}
      </button>
    );
  };

  const RowTransactions = (item) => {
    return (
      <>
        {address && (
          <tr>
            <td>
              {(
                parseInt(BigNumber.from(item.item[0]).toString()) / 1e18
              ).toLocaleString()}{" "}
              UFCL
            </td>
            <td>
              {parseInt(
                parseInt(BigNumber.from(item.item[3]).toString()) / 86400
              )}{" "}
              Days
            </td>
            <td>
              {moment(
                parseInt(BigNumber.from(item.item[1]).toString()) * 1000
              ).format("D MMMM YYYY HH:mm")}
            </td>

            <td>
              {moment(parseInt(BigNumber.from(item.item[1]).toString()) * 1000)
                .add(
                  parseInt(BigNumber.from(item.item[3]).toString()),
                  "seconds"
                )
                .format("D MMMM YYYY HH:mm")}
            </td>
            <td>
              <b>
                {parseInt(BigNumber.from(item.item[2]).toString()) / 100}% of
                tokens on top
              </b>
            </td>
            <td>
              {(
                parseInt(BigNumber.from(item.item[5]).toString()) / 1e18
              ).toLocaleString()}{" "}
              UFCL
            </td>
            <td style={{ color: "#27AE60" }}>
              <b>
                {(
                  ((parseInt(BigNumber.from(item.item[2]).toString()) + 10000) *
                    parseInt(BigNumber.from(item.item[0]).toString())) /
                  10000 /
                  1e18
                ).toLocaleString()}{" "}
                UFCL
              </b>
            </td>
            <td>
              {parseInt(BigNumber.from(item.item[6]).toString()) === 1 ? (
                <HandleClaim
                  id={parseInt(BigNumber.from(item.item[4]).toString())}
                />
              ) : (
                <button
                  className="transactions-cancel-btn"
                  onClick={() =>
                    handleShow(
                      parseInt(BigNumber.from(item.item[4]).toString())
                    )
                  }
                >
                  Cancel
                </button>
              )}
            </td>
          </tr>
        )}
      </>
    );
  };

  const RowTransactionsMobile = (item) => {
    return (
      <>
        {address && (
          <div className="transaction-card">
            {/* Transaction body */}
            <div className="transaction-body-mobile">
              <div className="transaction-body-text">
                <span>Locked Amount</span>
                <span>
                  {(
                    parseInt(BigNumber.from(item.item[0]).toString()) / 1e18
                  ).toLocaleString()}{" "}
                  UFCL
                </span>
              </div>
              <div className="transaction-body-text">
                <span>Duration</span>
                <span>
                  {parseInt(
                    parseInt(BigNumber.from(item.item[3]).toString()) / 86400
                  )}{" "}
                  Days
                </span>
              </div>
              <div className="transaction-body-text">
                <span>Stake Date</span>
                <span>
                  {moment(
                    parseInt(BigNumber.from(item.item[1]).toString()) * 1000
                  ).format("D MMMM YYYY HH:mm")}
                </span>
              </div>
              <div className="transaction-body-text">
                <span>Unlock Date</span>
                <span>
                  {moment(
                    parseInt(BigNumber.from(item.item[1]).toString()) * 1000
                  )
                    .add(
                      parseInt(BigNumber.from(item.item[3]).toString()),
                      "seconds"
                    )
                    .format("D MMMM YYYY HH:mm")}
                </span>
              </div>
              <div className="transaction-body-text">
                <span>Interest Rate</span>
                <span>
                  <b>
                    {parseInt(BigNumber.from(item.item[2]).toString()) / 100}%
                    of tokens on top
                  </b>
                </span>
              </div>
              <div className="transaction-body-text">
                <span>Pending Reward</span>
                <span>
                  {(
                    parseInt(BigNumber.from(item.item[5]).toString()) / 1e18
                  ).toLocaleString()}{" "}
                  UFCL
                </span>
              </div>
              <div
                className="transaction-body-text"
                style={{ fontWeight: "bold" }}
              >
                <span>Total Claim</span>
                <span style={{ color: "#27AE60" }}>
                  {(
                    ((parseInt(BigNumber.from(item.item[2]).toString()) +
                      10000) *
                      parseInt(BigNumber.from(item.item[0]).toString())) /
                    10000 /
                    1e18
                  ).toLocaleString()}{" "}
                  UFCL
                </span>
              </div>
            </div>

            {/* Claim Button */}
            <div className="button-content-mobile">
              {parseInt(BigNumber.from(item.item[6]).toString()) === 1 ? (
                <HandleClaim
                  id={parseInt(BigNumber.from(item.item[4]).toString())}
                />
              ) : (
                // <HandleCancel
                //   id={parseInt(BigNumber.from(item.item[4]).toString())}
                // />
                <button
                  className="cancel-button-mobile"
                  onClick={() =>
                    handleShow(
                      parseInt(BigNumber.from(item.item[4]).toString())
                    )
                  }
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}
      </>
    );
  };

  const [currentId, setCurrentId] = useState();
  const handleShow = (id) => {
    setCurrentId(id);
    setShow(true);
  };

  return (
    <>
      <div className="transactions">
        <div className="transactions-head">
          <p>Live Stakings {address !== undefined && 
           userTotalStakeAmount > 0 && 
          <>
          (Total staked amount: {userTotalStakeAmount / 1e18} UFCL)
          </>}
          </p>
        </div>

        <table>
          <thead>
            <tr className="transactions-thead">
              {/* <th>Coin</th> */}
              <th>Locked Amount</th>
              <th>Duration</th>
              <th>Stake Date</th>
              <th>Unlock Date</th>
              <th>Interest Rate</th>
              <th>Pending Reward</th>
              <th>
                <b>Total Claim</b>
              </th>
              <th> </th>
            </tr>
          </thead>

          <tbody className="transactions-tbody">
            {test &&
              test.map(
                (item, index) =>
                  parseInt(BigNumber.from(item[0]).toString()) > 0 && (
                    <RowTransactions key={index} item={item} />
                  )
              )}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="transactionsMobile">
        <div className="transactions-head-mobile">
          <p>Live Stakings {address !== undefined && userTotalStakeAmount > 0 && 
          <>
          (Total staked amount: {userTotalStakeAmount / 1e18} UFCL)
          </>}</p>
        </div>
        {test &&
          test.map(
            (item, index) =>
              parseInt(BigNumber.from(item[0]).toString()) > 0 && (
                <RowTransactionsMobile key={index} item={item} />
              )
          )}
      </div>

      {/* Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <span>
            * If you cancel staking, you will get{" "}
            <b>charged with 20% cancellation </b> fees on your initial staking
            amount of tokens.
          </span>
        </Modal.Body>
        <Modal.Footer>
          <button className="refund-btn" onClick={handleClose}>
            Close
          </button>
          {/* <button className="cancel-btn" onClick={()=>CancelProcess()}>
            Submit
          </button> */}
          <HandleCancel
          // id={parseInt(BigNumber.from(item.item[4]).toString())}
          />
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Transaction;
