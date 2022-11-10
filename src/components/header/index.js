import React, { useState, useEffect } from "react";
import "./index.css";
import UFCL from "../../assets/UFCLLogo.png";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ConnectWallet } from "./connectButton";

function Header() {
  const [navStyle, setNavStyle] = useState("HeaderWrapper");

  const listenScrollEvent = () => {
    window.scrollY > 10
      ? setNavStyle("HeaderWrapperScroll")
      : setNavStyle("HeaderWrapper");
  };
  useEffect(() => {
    window.addEventListener("scroll", listenScrollEvent);
    return () => {
      window.removeEventListener("scroll", listenScrollEvent);
    };
  }, []);

  return (
    <div className={navStyle}>
      <div className="image-container">
        <img className="image" src={UFCL} alt="Logo" />
      </div>
      <div className="connect-button-container">
        <ConnectWallet />
      </div>
    </div>
  );
}

export default Header;
