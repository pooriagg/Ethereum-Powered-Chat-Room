import React, { useState, useCallback, useMemo } from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import Web3 from 'web3';
import { toast } from 'react-toastify';

import Context from "./context/Context";

import NavBar from './components/NavBar';
import ChatRoom from './components/ChatRoom';
import SearchUsers from "./components/SearchUsers";
import UserChats from './components/UserChats';

declare const window: any;


const App: React.FunctionComponent = (): JSX.Element => {
  const [ userAccount, setUserAccount ] = useState<string>();
  
  const { ethereum } = window;

  const web3 = useMemo(() => new Web3(
    ethereum
  ), [ ethereum ]);

  const web3Http = useMemo(() => new Web3(
    new Web3.providers.HttpProvider(
      "https://polygon-mumbai.g.alchemy.com/v2/7d3CawiE6tv5NwqMVvTCyrVL6jGRiK8X"
    )
  ), []);

  const web3Wss = useMemo(() => new Web3(
    new Web3.providers.WebsocketProvider(
      "wss://polygon-mumbai.g.alchemy.com/v2/7d3CawiE6tv5NwqMVvTCyrVL6jGRiK8X"
    )
  ), []);

  const checkNetwork = useCallback(async (): Promise<boolean> => {
    if (await web3.eth.getChainId() === 80001) {
      return true;
    } else {
      return false;
    };
  }, [ web3 ]);

  const checkWallet = useCallback(() => {
    if (ethereum) {
      return true;
    } else {
      return false;
    };
  }, [ ethereum ]);

  const connectWallet = useCallback(async (): Promise<void> => {
    try {
      if (
        checkWallet() &&
        await checkNetwork()
      ) {
        const [ currentAccount ] = await web3.eth.requestAccounts();

        if (currentAccount) {
          setUserAccount(
            currentAccount
          );
  
          toast.success("Wallet connected !", {
            toastId: "Wallet connected"
          });

          console.log(`Connected-Account => ${currentAccount}`);
        } else {
          throw new Error("Cannot fetch user current account !");
        };
      } else {
        toast.warn("Please change your chain, to Polygon-Mumbai Testnet.", {
          toastId: "Incorrect chain detected"
        });
      };
    } catch (err) {
      toast.error("Failed to connect your wallet, please try again later.", {
        toastId: "Error in fetching user account"
      });
    };
  }, [ web3, checkNetwork, checkWallet ]);

  useMemo(() => ethereum.on("accountsChanged", () => {
    if (userAccount) {
      toast.warn("Your account changed, Please click here to re-connect !", {
        toastId: "Re-Conntect",
        onClick: connectWallet
      });
    };
  }), [ ethereum, userAccount, connectWallet ]);

  useMemo(() => ethereum.on("chainChanged", () => {
    window.location.reload();
  }), [ ethereum ]);


  return (
    <Context.Provider 
      value={{
        userAccount,
        web3,
        web3Http,
        web3Wss,
        ethereum: window.ethereum,
        checkNetwork,
        checkWallet
      }}
    >
      <NavBar />

      <Routes>
        <Route path="/" element={<Navigate to="/chatDapp" />} />
        <Route path="/chatDapp" element={<UserChats connect={connectWallet} />} />
        <Route path="/search" element={<SearchUsers />} />
        <Route path="/chatroom/:recepientAddress" element={<ChatRoom />} />
      </Routes>
    </Context.Provider>
  );
};

export default App;