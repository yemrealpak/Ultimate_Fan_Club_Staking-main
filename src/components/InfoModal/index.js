import React, { useEffect, useState } from "react";
import {Modal} from "react-bootstrap";
import "./index.css";
import { StakingAddress, StakingABI } from "../../contracts/contracts.js";
import {useAccout , useContractReads , useConractWrite } from "wagmi";
import { BigNumber, ethers } from "ethers";

function InfoModal() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const stakingContractAddress = StakingAddress();


    const stakingContract = {
      addressOrName: stakingContractAddress,
      contractInterface: StakingABI,
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


 
  return (
    <>
    <div className="InfoModal" onClick={handleShow}>
      <button className="infoButton" onClick={handleShow}>Admin Zone</button>
    </div>
    {/* Modal */}
    <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          adminss
        </Modal.Body>
        <Modal.Footer>
          <button className="cancel-buton" onClick={handleClose}>
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </>
    


  )
}

export default InfoModal