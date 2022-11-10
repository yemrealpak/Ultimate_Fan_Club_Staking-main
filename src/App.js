import React,{useEffect,useState} from "react";
import "./App.css";
import Card from "./components/card";
import Header from "./components/header";
import Title from "./components/title";
import Transaction from "./components/transaction";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAccount ,useContractRead} from "wagmi";
import {StakingAddress,StakingABI} from "./contracts/contracts.js";
import InfoModal from "./components/InfoModal";

function App() {


  const { address } = useAccount();


  const {data,refetch} = useContractRead({
    addressOrName:StakingAddress(),
    contractInterface:StakingABI,
    functionName:"isAuthorized",
    args:[address]
  });

  useEffect(() => {
    refetch();
  }, [address]);


  return (
    <div className="app">
      <ToastContainer />
      <Header />
      <div className="layout">
        <Title />
        <Card isAdmin={data && data}/>
        <Transaction />
      </div>
    </div>
  );
}

export default App;
