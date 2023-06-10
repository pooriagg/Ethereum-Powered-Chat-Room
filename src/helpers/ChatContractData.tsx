import Web3 from "web3";


const ABI: any = [ { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": false, "internalType": "string", "name": "message", "type": "string" } ], "name": "Message", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "_to", "type": "address" }, { "internalType": "string", "name": "_message", "type": "string" } ], "name": "sendMessage", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ];
const Address: string = "0xcfe4BcfC6C2dD84F4209BCB44bD5008B10A589F0";

const web3Http = new Web3(
    new Web3.providers.HttpProvider(
        "https://polygon-mumbai.g.alchemy.com/v2/7d3CawiE6tv5NwqMVvTCyrVL6jGRiK8X"
    )
);
const web3Ws = new Web3(
    new Web3.providers.WebsocketProvider(
        "wss://polygon-mumbai.g.alchemy.com/v2/7d3CawiE6tv5NwqMVvTCyrVL6jGRiK8X"
    )
);

export const chatHttps = new web3Http.eth.Contract(
    ABI,
    Address
);
export const chatWss = new web3Ws.eth.Contract(
    ABI,
    Address
);
export const deployedBlock = "36560915";