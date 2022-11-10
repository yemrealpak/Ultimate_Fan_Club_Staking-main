import React, { useEffect, useState } from "react";
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

const Test = (show) => {


    const { address, isConnecting, isDisconnected } = useAccount();
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
  
  
    const { data, isError, isLoading,refetch } = useContractReads({
      contracts: [
        {
          ...stakingContract,
          functionName: "poolInfo",
          args: [0],
        },
        {
          ...stakingContract,
          functionName: "poolInfo",
          args: [1],
        },
        {
          ...stakingContract,
          functionName: "poolInfo",
          args: [2],
        },
        {
          ...stakingContract,
          functionName: "poolInfo",
          args: [3],
        },
        {
          ...tokenContract,
          functionName: "balanceOf",
          args: [address],
        },
        {
          ...tokenContract,
          functionName: "allowance",
          args: [address,stakingContractAddress],
        },
      ],
    });
    
   
  
 
    
    useEffect(() => {
   
       
        if(!show){
            const interval = setInterval(() => {
                refetch();
              }, 5000);
              return () => clearInterval(interval);
        }
       
    }, [show])
  
  
  
    return data
  }

  export default Test;