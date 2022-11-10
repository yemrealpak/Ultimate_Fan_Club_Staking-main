import React, { useEffect, useState } from "react";
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
import { toast } from "react-toastify";
import Countdown from "react-countdown";

import { BigNumber, ethers } from "ethers";

import moment from "moment";
import { Modal } from "react-bootstrap";

function Card({ isAdmin }) {
  const { address, isConnecting, isDisconnected } = useAccount();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);

  const stakingContractAddress = StakingAddress();

  const stakingContract = {
    addressOrName: stakingContractAddress,
    contractInterface: StakingABI,
  };
  const tokenContractAddress = TokenAddress();

  const tokenContract = {
    addressOrName: tokenContractAddress,
    contractInterface: erc20ABI,
  };

  const { data, isError, isLoading, refetch } = useContractReads({
    contracts: [
      {
        ...stakingContract,
        functionName: "getDynamicPoolInfo",
        args: [0],
      },
      {
        ...stakingContract,
        functionName: "getDynamicPoolInfo",
        args: [1],
      },
      {
        ...stakingContract,
        functionName: "getDynamicPoolInfo",
        args: [2],
      },
      {
        ...tokenContract,
        functionName: "balanceOf",
        args: [address],
      },
      {
        ...tokenContract,
        functionName: "allowance",
        args: [address, stakingContractAddress],
      },
      {
        ...stakingContract,
        functionName: "getTotals",
      },
    ],
  });

  useEffect(() => {
    if (!show) {
      const interval = setInterval(() => {
        refetch();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [show]);

  const [pool30, setPool30] = useState([]);
  const [pool90, setPool90] = useState([]);
  const [pool180, setPool180] = useState([]);

  const [currentData, setCurrentData] = useState([]);

  const dataFetching = () => {
    data &&
      data.map((item, index) => {
        if (index === 0) {
          setPool30(item);
        } else if (index === 1) {
          setPool90(item);
        } else if (index === 2) {
          setPool180(item);
        }
      });
  };
  const [getTotalsInfo, setGetTotalsInfo] = useState([]);

  const fetchGetTotalsInfo = () => {
    data && data[5] && setGetTotalsInfo(data[5]);
  };

  useEffect(() => {
    dataFetching();
    allowenceComp();
    fetchGetTotalsInfo();

    // setCurrentData(pool60);
  }, [data]);

  const [activiveBtn, setActiveBtn] = useState();

  const handleDuration = async (duration) => {
    setActiveBtn(duration);

    if (duration === "30") {
      setCurrentData(pool30);
    } else if (duration === "90") {
      setCurrentData(pool90);
    } else if (duration === "180") {
      setCurrentData(pool180);
    }
  };

  const [amount, setAmount] = useState();

  const handleMaxAmount = () => {
    setAmount(parseInt(BigNumber.from(data && data[3]).toString()) / 1e18);
  };

  {
    /* allowence value and enable/approve button */
  }
  const [allowence, setAllowence] = useState();

  const allowenceComp = () => {
    setAllowence(
      data && data[4] && parseInt(BigNumber.from(data[4]).toString())
    );
  };
  const currentAllowence = 1e26;

  const currentBtn = () => {
    if (allowence > currentAllowence) {
      return "approve";
    } else {
      return "enable";
    }
  };

  const SubmitBtn = () => {
    const poolId =
      parseInt(activiveBtn) === 30
        ? 0
        : parseInt(activiveBtn) === 90
        ? 1
        : parseInt(activiveBtn) === 180
        ? 2
        : "Nan";

    const newAmount = BigNumber.from(parseInt(amount)).mul(
      BigNumber.from(10).pow(18)
    );

    const { config } = usePrepareContractWrite({
      addressOrName: stakingContractAddress,
      contractInterface: StakingABI,
      functionName: "deposit",
      args: [poolId, newAmount],
      onError(error) {
        toast.error(error.reason, {
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

    const { write, data } = useContractWrite(config);

    const { isLoading } = useWaitForTransaction({
      hash: data?.hash,
      wait: data?.wait,
      onSuccess(data) {
        refetch();
        handleClose();
        toast.success("Stake Successful", {
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
    });

    return (
      <>
        <button
          disabled={isLoading}
          className="submit-btn"
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
      </>
    );
  };

  const EnableBtn = () => {
    const { config, error } = usePrepareContractWrite({
      addressOrName: tokenContractAddress,
      contractInterface: erc20ABI,
      functionName: "approve",
      args: [stakingContractAddress, ethers.constants.MaxUint256],
    });

    const { write, data } = useContractWrite(config);

    const { isLoading } = useWaitForTransaction({
      hash: data?.hash,
      wait: data?.wait,
      onSuccess(data) {
        toast.success("Staking Enabled", {
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
        // },1000);
      },
      onError(error) {
        toast.error("Staking Disabled", {
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
        className="enable-button"
        disabled={isLoading}
        onClick={() => write()}
      >
        Enable Staking{" "}
        {isLoading && (
          <i
            style={{ marginLeft: "3px", marginTop: "3px" }}
            className="fa fa-spinner fa-spin"
          ></i>
        )}
      </button>
    );
  };

  const disabledApprove = () => {
    if (activiveBtn == undefined || amount == undefined || amount <= 0) {
      return true;
    } else {
      return false;
    }
  };

  let renderer1 =
    pool30 && pool30[5]
      ? parseInt(BigNumber.from(pool30[5]).toString()) * 1000
      : 0;
  let renderer2 =
    pool90 && pool90[5]
      ? parseInt(BigNumber.from(pool90[5]).toString()) * 1000
      : 0;
  let renderer3 =
    pool180 && pool180[5]
      ? parseInt(BigNumber.from(pool180[5]).toString()) * 1000
      : 0;

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span style={{ color: "#000" }}>Time is up !</span>;
    } else {
      return (
        <div className="countDownWrapper">
          <span style={{ color: "#000" }}>
            {days > 0 ? days + " d " : null}
            {hours} h {minutes} m {days > 0 ? null : seconds + " s"}
          </span>{" "}
        </div>
      );
    }
  };

  const OpenClosePool = ({poolId,isOpen}) => {
    const { config, error } = usePrepareContractWrite({
      addressOrName: stakingContractAddress,
      contractInterface: StakingABI,
      functionName: "togglePool",
      args: [poolId],
    });

    const { write, data } = useContractWrite(config);

    const { isLoading } = useWaitForTransaction({
      hash: data?.hash,
      wait: data?.wait,
      onSuccess(data) {
        toast.success("Pool Status Changed Successfully");
      },
      onError(error) {
        toast.error("Pool Status Changed Error");
      },
    });

    return (
      <div className="poolButton">
        <button className={!isOpen ? "openPool" : "closePool"} onClick={() => write()}>
          {!isOpen ? "Open Pool " : "Close Pool "}
          {isLoading && (
            <i
              style={{ marginLeft: "3px", marginTop: "3px" }}
              className="fa fa-spinner fa-spin"
            ></i>
          )}
        </button>
      </div>
    );
  };

  const [extendPoolDuration, setExtendPoolDuration] = useState();

  const HandleExtendPool = (poolID) => {
    const { config, error } = usePrepareContractWrite({
      addressOrName: stakingContractAddress,
      contractInterface: StakingABI,
      functionName: "extendPoolLength",
      args: [poolID.poolId, parseInt(extendPoolDuration)],
    });

    const { write, data } = useContractWrite(config);

    const { isLoading } = useWaitForTransaction({
      hash: data?.hash,
      wait: data?.wait,
      onSuccess(data) {
        toast.success("Pool Duration Extended Successfully");
        setExtendPoolDuration();
      },
      onError(error) {
        toast.error("Pool Duration Extended Error");
      },
    });

    return (
      <button
        className={extendPoolDuration <= 0 ? "disExtendBtn" : "extendBtn"}
        disabled={extendPoolDuration <= 0 ? true : false}
        onClick={() => write()}
      >
        Extend{" "}
        {isLoading && (
          <i
            style={{ marginLeft: "3px", marginTop: "3px" }}
            className="fa fa-spinner fa-spin"
          ></i>
        )}
      </button>
    );
  };

  return (
    <>
      {isAdmin && isAdmin == true && (
        <div className="InfoModal">
          <button className="infoButton" onClick={handleShow1}>
            Admin Zone
          </button>
        </div>
      )}

      <div className="cardContainer">
        {/* Duration  */}
        <div className="duration">
          <div className="durationText">
            <span>POOLS</span>
          </div>
          <div className="days-content">
            <button
              className={
                pool30 && pool30[3] && pool30[4]
                  ? activiveBtn == 30
                    ? "active-days-layout"
                    : "days-layout"
                  : "disabled-days-layout"
              }
              onClick={() => handleDuration("30")}
              disabled={pool30 && pool30[3] && pool30[4] ? false : true}
            >
              30 Days
            </button>
            <button
              className={
                pool90 && pool90[3] && pool90[4]
                  ? activiveBtn == 90
                    ? "active-days-layout"
                    : "days-layout"
                  : "disabled-days-layout"
              }
              onClick={() => handleDuration("90")}
              disabled={pool90 && pool90[3] && pool90[4] ? false : true}
            >
              90 Days
            </button>
            <button
              className={
                pool180 && pool180[3] && pool180[4]
                  ? activiveBtn == 180
                    ? "active-days-layout"
                    : "days-layout"
                  : "disabled-days-layout"
              }
              onClick={() => handleDuration("180")}
              disabled={pool180 && pool180[3] && pool180[4] ? false : true}
            >
              180 Days
            </button>
          </div>
        </div>

        {/* Lock Amount   */}
        <div className="lock-amount">
          <div className="lock-amount-text">
            <span className="lock-head">STAKE AMOUNT</span>
            <span className="lock-value">
              <span>Available </span>
              <span className="amount-mobile">Amount </span>
              <span>
                {address === undefined
                  ? "N/A"
                  : data &&
                    data[3] &&
                    (
                      parseInt(BigNumber.from(data[3]).toString()) / 1e18
                    ).toLocaleString()}{" "}
                UFCL
              </span>
            </span>
          </div>

          <div className="lock-input">
            <input
              type="number"
              className="input-number"
              placeholder="Please Enter The Amount"
              min={0}
              value={amount === undefined ? "" : amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <input
              type="number"
              className="input-number-mobile"
              placeholder="0"
              min={0}
              value={amount === undefined ? "" : amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <div className="lock-input-left">
              <span className="lock-input-text">UFCL</span>
              <button
                className="lock-input-button"
                onClick={() => handleMaxAmount()}
              >
                Max Amount
              </button>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="summary">
          <span className="summary-head">Summary </span>
          <div className="summary-body">
            <div className="stake-date">
              <span>Stake Date</span>
              <span>{moment().format("D MMMM YYYY HH:mm")}</span>
            </div>
            <div className="redemption-date">
              <span>Unlock Date</span>
              <span>
                {moment()
                  .add(
                    currentData &&
                      currentData[2] &&
                      parseInt(BigNumber.from(currentData[2]).toString()),
                    "seconds"
                  )
                  .format("D MMMM YYYY HH:mm")}
              </span>
            </div>
            {/* <div className="interests">
            <span>Interest Rate</span>
            <span>
              <b>
                {currentData && !currentData[0]
                  ? "N/A "
                  : parseInt(BigNumber.from(currentData[0]).toString()) / 100 +
                    "%"}
                of tokens on top
              </b>
            </span>
          </div> */}
            <div className="interests">
              <span>APY</span>
              <span>
                {currentData && !currentData[1]
                  ? "N/A "
                  : parseInt(BigNumber.from(currentData[1]).toString()) + "%"}
              </span>
            </div>
            <div className="total-earn">
              <span>Total Earn</span>
              <span style={{ color: "#27AE60" }}>
                {currentData && !currentData[0]
                  ? "0 UFCL"
                  : amount > 0
                  ? (
                      ((parseInt(BigNumber.from(currentData[0]).toString()) +
                        10000) *
                        amount) /
                      10000
                    ).toLocaleString() + " UFCL"
                  : "0 UFCL"}
              </span>
            </div>
          </div>
        </div>

        {/* Warning */}
        {currentBtn() == "approve" && (
          <div className="warning">
            <p>
              * If you cancel staking, you will get{" "}
              <b>charged with 20% cancellation </b>
              fees on your initial staking amount of tokens.
            </p>
          </div>
        )}

        {/* Approve Staking Button */}
        <div className="button-content">
          {currentBtn() == "approve" ? (
            <button
              className={
                disabledApprove() === true
                  ? "disabled-approve-button"
                  : "approve-button"
              }
              disabled={disabledApprove()}
              onClick={handleShow}
            >
              Approve Staking
            </button>
          ) : (
            <EnableBtn />
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
            <button className="cancel-buton" onClick={handleClose}>
              Cancel
            </button>
            <SubmitBtn />
          </Modal.Footer>
        </Modal>
      </div>
      <Modal show={show1} onHide={handleClose1} className="adminModal">
        <Modal.Header closeButton>
          <Modal.Title>Admin Zone</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="AdminInfoHeader">
            <>
              <div className="AdminTotalsRow">
                <div className="AdminStakeAmount">
                  <div className="adminStakeTitle">Total Contributors</div>
                  <div className="adminStakeText">
                    {getTotalsInfo &&
                      getTotalsInfo[0] &&
                      parseInt(BigNumber.from(getTotalsInfo[0]).toString())}
                  </div>
                </div>
                <div className="AdminStakeAmount">
                  <div className="adminStakeTitle">
                    Total Reward Distributed
                  </div>
                  <div className="adminStakeText">
                    {getTotalsInfo &&
                      getTotalsInfo[3] &&
                      parseInt(
                        BigNumber.from(getTotalsInfo[3]).toString() / 1e18
                      ).toLocaleString()}{" "}
                    UFCL
                  </div>
                </div>
              </div>
              <div className="AdminTotalsRow">
                <div className="AdminStakeAmount">
                  <div className="adminStakeTitle">
                    Total Live Staking Amount
                  </div>
                  <div className="adminStakeText">
                    {getTotalsInfo &&
                      getTotalsInfo[1] &&
                      (
                        parseInt(BigNumber.from(getTotalsInfo[1]).toString()) /
                        1e18
                      ).toLocaleString()}{" "}
                    UFCL
                  </div>
                </div>
                <div className="AdminStakeAmount">
                  <div className="adminStakeTitle">Total Reward Debt</div>
                  <div className="adminStakeText">
                    {getTotalsInfo &&
                      getTotalsInfo[2] &&
                      parseInt(
                        BigNumber.from(getTotalsInfo[2]).toString() / 1e18
                      ).toLocaleString()}{" "}
                    UFCL
                  </div>
                </div>
              </div>
            </>
            {/*Pools*/}
            <div>
              {/*pool30*/}
              <div className="poolContent">
                <div className="poolContentTitle">
                  <div className="poolContentTitleText">30 Days</div>
                </div>

                <div className="poolFooter">
                  <div className="liveStakeAmount">
                    <div className="adminStakeTitle">Pool Closes In</div>
                    <div className="adminStakeText">
                      {pool30 && pool30[5] ? (
                        <Countdown date={renderer1} renderer={renderer} />
                      ) : null}
                    </div>
                  </div>
                  <div className="liveStakeAmount">
                    <div className="adminStakeTitle">Extend Pool Duration</div>
                    <div className="adminStakeText">
                      <div className="extendInputWrapper">
                        <input
                          type="number"
                          placeholder="days"
                          className="extendPoolInput"
                          value={extendPoolDuration}
                          onChange={(e) =>
                            setExtendPoolDuration(e.target.value)
                          }
                        />

                        <HandleExtendPool poolId={0} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="poolFooter">
                  <div className="liveStakeAmount">
                    <div className="adminStakeTitle">Live Stake Amount</div>
                    <div className="adminStakeText">
                      {pool30 &&
                        pool30[6] &&
                        parseInt(
                          BigNumber.from(pool30[6]).toString() / 1e18
                        ).toLocaleString()}
                    </div>
                  </div>
                  <div className="liveStakeAmount">
                    <div className="adminStakeTitle">Reward Debt</div>
                    <div className="adminStakeText">
                      {pool30 &&
                        pool30[7] &&
                        parseInt(
                          BigNumber.from(pool30[7]).toString() / 1e18
                        ).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="poolAdminButtons">
                  <OpenClosePool poolId={0} isOpen={pool30 && pool30[3]} />
                </div>
              </div>
              {/* pool90 */}
              <div className="poolContent">
                <div className="poolContentTitle">
                  <div className="poolContentTitleText">90 Days</div>
                </div>

                <div className="poolFooter">
                  <div className="liveStakeAmount">
                    <div className="adminStakeTitle">Pool Closes In</div>
                    <div className="adminStakeText">
                      {pool90 && pool90[5] ? (
                        <Countdown date={renderer2} renderer={renderer} />
                      ) : null}
                    </div>
                  </div>
                  <div className="liveStakeAmount">
                    <div className="adminStakeTitle">Extend Pool Duration</div>
                    <div className="adminStakeText">
                      <div className="extendInputWrapper">
                        <input
                          type="number"
                          placeholder="days"
                          className="extendPoolInput"
                          value={extendPoolDuration}
                          onChange={(e) =>
                            setExtendPoolDuration(e.target.value)
                          }
                        />

                        <HandleExtendPool poolId={1} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="poolFooter">
                  <div className="liveStakeAmount">
                    <div className="adminStakeTitle">Live Stake Amount</div>
                    <div className="adminStakeText">
                      {pool90 &&
                        pool90[6] &&
                        parseInt(
                          BigNumber.from(pool90[6]).toString() / 1e18
                        ).toLocaleString()}
                    </div>
                  </div>
                  <div className="liveStakeAmount">
                    <div className="adminStakeTitle">Reward Debt</div>
                    <div className="adminStakeText">
                      {pool90 &&
                        pool90[7] &&
                        parseInt(
                          BigNumber.from(pool90[7]).toString() / 1e18
                        ).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="poolAdminButtons">
                  <OpenClosePool poolId={1} isOpen={pool90 && pool90[3]}/>
                </div>
              </div>

              {/* pool180 */}
              <div className="poolContent">
                <div className="poolContentTitle">
                  <div className="poolContentTitleText">180 Days</div>
                </div>

                <div className="poolFooter">
                  <div className="liveStakeAmount">
                    <div className="adminStakeTitle">Pool Closes In</div>
                    <div className="adminStakeText">
                      {pool180 && pool180[5] ? (
                        <Countdown date={renderer3} renderer={renderer} />
                      ) : null}
                    </div>
                  </div>
                  <div className="liveStakeAmount">
                    <div className="adminStakeTitle">Extend Pool Duration</div>
                    <div className="adminStakeText">
                      <div className="extendInputWrapper">
                        <input
                          type="number"
                          placeholder="days"
                          className="extendPoolInput"
                          value={extendPoolDuration}
                          onChange={(e) =>
                            setExtendPoolDuration(e.target.value)
                          }
                        />

                        <HandleExtendPool poolId={2} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="poolFooter">
                  <div className="liveStakeAmount">
                    <div className="adminStakeTitle">Live Stake Amount</div>
                    <div className="adminStakeText">
                      {pool180 &&
                        pool180[6] &&
                        parseInt(
                          BigNumber.from(pool180[6]).toString() / 1e18
                        ).toLocaleString()}
                    </div>
                  </div>
                  <div className="liveStakeAmount">
                    <div className="adminStakeTitle">Reward Debt</div>
                    <div className="adminStakeText">
                      {pool180 &&
                        pool180[7] &&
                        parseInt(
                          BigNumber.from(pool180[7]).toString() / 1e18
                        ).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="poolAdminButtons">
                  <OpenClosePool poolId={2} isOpen={pool180 && pool180[3]}/>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="cancel-buton" onClick={handleClose1}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Card;
