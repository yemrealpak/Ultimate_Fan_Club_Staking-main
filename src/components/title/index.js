import React,{useEffect} from "react";
import "./index.css";
import { useAccount,useContractReads } from "wagmi";
import { StakingAddress,StakingABI } from "../../contracts/contracts";
import { BigNumber,ethers } from "ethers";
import UFCL from "../../assets/UFCLLogo.png";

function Title() {

  // const stakingContract = {
  //   addressOrName: StakingAddress,
  //   contractInterface: StakingABI,
  // };

  // const { data, isError, isLoading,refetch } = useContractReads({
  //   contracts: [
  //     {
  //       ...stakingContract,
  //       functionName: "getTotalContributors",
      
  //     },
  //     {
  //       ...stakingContract,
  //       functionName: "getTotalLiveStakingAmount",
    
  //     },
  //     {
  //       ...stakingContract,
  //       functionName: "getTotalRewardDistributed",
      
  //     },
  //   ],
  // });

  // useEffect(() => {
  //   const interval = setInterval(() => {
     
  //     refetch();
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, []);

  
 

 
  return (
    <div className="artex-head-title">
      {/* <span className="font-title">Locked Staking</span>
      <span className="head-text">
        Total Contributers: <b>{data && parseInt(BigNumber.from(data[0]).toString())}</b>
      </span>
      <span className="head-text">
        Total Locked ultimateFanClub: <b>{data && (parseInt(BigNumber.from(data[1]).toString())/1e18).toLocaleString()}</b>
      </span>
      <span className="head-text">
        Total Rewards Distributed: <b>{data && (parseInt(BigNumber.from(data[2]).toString())/1e18).toLocaleString()}</b>
      </span> */}
      {/* <div className="ultimateFanClubTitle">
        <img src={ultimateFanClub} alt="King Corgi Logo" className="ultimateFanClubImg"/>
      </div> */}
    </div>
  );
}

export default Title;
