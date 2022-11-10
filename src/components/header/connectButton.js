import { ConnectButton } from '@rainbow-me/rainbowkit';
import "./index.css";
import {IoWallet} from "react-icons/io5";

export const ConnectWallet = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        return (
          <div
            {...(!mounted && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!mounted || !account || !chain) {
                return (
                  <button onClick={openConnectModal} type="button" className='connectWallet'>
                    <IoWallet className='wallet-icon' size="28" />
                    <span>Connect Wallet</span>
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button" className='wrongNetwork'>
                    Wrong Network
                  </button>
                );
              }
              return (
                <div className="connected-container">
                  <button
                    onClick={openChainModal}
                  
                    type="button"
                    className='chain-button'
                  >
                    {chain.hasIcon && (
                      <div
                        // style={{
                        //   background: chain.iconBackground,
                        
                        // }}
                        className="chain-icon"
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            className="chain-icon-img"
                          />
                        )}
                      </div>
                    )}
                    <span className='chainWeb'>{chain.name == "Goerli Test Network"  ?  "Goerli" : "Binance"}</span>
                    <span className='chainMobile'>{chain.name == "Goerli Test Network"  ?  "Goerli" : "BSC"}</span>
                  </button>
                  <button onClick={openAccountModal} type="button" className='connectingWallet'>
                    <IoWallet className='wallet-icon' size="28" />
                    <span className='account-displayName'>{account.displayName}</span>
                    <span className='account-address'>{account.address.slice(2,5)+"..."+account.address.slice(account.address.length-3, account.address.length)}</span>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};