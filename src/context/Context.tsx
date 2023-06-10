import { createContext } from "react";
import Web3 from "web3";


interface IWeb3 {
    web3Http?: Web3,
    web3Wss?: Web3,
    web3?: Web3,
    userAccount?: string,
    ethereum?: any,
    checkNetwork?: () => Promise<boolean>,
    checkWallet?: () => boolean
};

const web3Context = createContext<IWeb3>({});

export default web3Context;