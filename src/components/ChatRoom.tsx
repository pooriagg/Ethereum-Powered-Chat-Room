import React, { useContext, useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";

import Context from "../context/Context";
import { chatHttps, chatWss, deployedBlock } from "../helpers/ChatContractData";


const ChatRoom: React.FunctionComponent = (): JSX.Element => {
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ refresh, setRefresh ] = useState<boolean>();
    const [ chats, setChats ] = useState<any[]>([]);
    const [ message, setMessage ] = useState<string>("");

    const { userAccount, checkNetwork, checkWallet, web3 } = useContext(Context);

    const navigate = useNavigate();
    const { recepientAddress: recepient } = useParams(); 

    useEffect(() => {
        if (
            userAccount &&
            recepient &&
            web3?.utils.isAddress(recepient)
        ) {
            try {
                setLoading(true);
            
                // Listen to incoming chats
                const Options_1 = {
                    filter: {
                        to: [ userAccount, recepient ],
                        from: [ userAccount, recepient ]
                    }
                };

                chatWss.events.Message(Options_1, (err: any) => {
                    if (!err) {
                        toast.info("You received a new message, Click to refresh the chat", {
                            toastId: "received a new message",
                            onClick: () => setRefresh(!refresh)
                        });
                    } else {
                        toast.warn("Falied to listen to incoming chats !", {
                            toastId: "Falied to listen to incoming chats"
                        });
                    };
                });

                // Fetch all previous chats
                const Options_2 = {
                    fromBlock: deployedBlock,
                    toBlock: "latest",
                    filter: {
                        to: [ userAccount, recepient ],
                        from: [ userAccount, recepient ]
                    }
                };

                chatHttps.getPastEvents("Message", Options_2, (err, events) => {
                    if (!err) {
                        setChats(events);
                        setLoading(false);
                    } else {
                        toast.error("Falied to fetch previous chats !", {
                            toastId: "Falied to fetch previous chats"
                        });
                    };
                });
            } catch (error) {
                toast.error("Somthing went wrong !", {
                    toastId: "Somthing went wrong"
                });

                console.warn(error);
            };
        } else {
            navigate("/");
        };
    }, [ userAccount, navigate, web3, recepient, refresh ]);

    const sendMessage = useCallback(async () => {
        try {
            if (!(await checkNetwork!())) {
                return toast.warn("Please change your chain, to Polygon-Mumbai Testnet.", {
                    toastId: "Incorrect chain detected"
                }); 
            };
            
            if (!checkWallet!()) {
                return toast.warn("Wallet is not connected to the network !", {
                    toastId: "Wallet is not connected to the network"
                });    
            };
            
            if (!message.length) {
                return toast.warn("Enter valid message !", {
                    toastId: "Enter valid message"
                });    
            };
            
            // Execute the main code after validations
            await toast.promise(async () => {
                let from, to, data, value, chainId, gas, gasPrice, nonce;

                from = userAccount;
                to = chatHttps.options.address; 
                data = chatHttps.methods.sendMessage(recepient, message).encodeABI({ from });
                nonce = await web3?.eth.getTransactionCount(userAccount!);
                gasPrice = await web3?.eth.getGasPrice();
                gas = await web3?.eth.estimateGas({ to, from, data });
                value = "0x0";
                chainId = 80001;

                const TX = {
                    from,
                    to,
                    data,
                    value,
                    chainId,
                    nonce,
                    gas,
                    gasPrice
                };

                //@ts-ignore
                const { status } = await web3?.eth.sendTransaction(TX);

                if (!status) {
                    console.error("Falied to send message !");
                };
            }, {
                success: "Message sent",
                pending: "Sending message ...",
                error: "Failed to send message"
            });
        } catch (error) {
            toast.error("Failed to send message !", {
                toastId: "Failed to send message"
            });

            console.warn(error);
        };
    }, [ message, userAccount, checkNetwork, checkWallet, web3, recepient ]);


    return (
        <React.Fragment>
            {
                loading ? (
                    <div className="col-1 mx-auto mt-5">
                        <ScaleLoader
                            color="black"
                            height={65}
                            width={5}
                        />
                    </div>
                ) : (
                    <div className="col-5 mx-auto card my-5">
                        <div className="card-header text-center">
                            Chats
                        </div>

                        <div className="card-body">
                            <form className="form-control mb-4">
                                <input type="text" className="form-control my-3" placeholder="Enter message" onChange={(e) => {
                                    setMessage(e.target.value);
                                }}/>
                                <button type="button" className="btn btn-primary w-100 mb-2" onClick={sendMessage}>Send</button>
                            </form>

                            {
                                chats.length > 0 ? (
                                    chats.map(({ returnValues: { from, message } }, index) => (
                                        <div
                                            onClick={() => {
                                                window.navigator.clipboard.writeText(message).then(() => {
                                                    toast.info("Copied!");
                                                });
                                            }}
                                            style={{
                                                cursor: "pointer"
                                            }}
                                            key={index}
                                            title="Click to copy"
                                            className={`alert alert-${from === userAccount ? "secondary" : "primary"} text-center`}
                                        >
                                            {`${from === userAccount ? "You" : "Recepient"}`} - { message }
                                        </div>
                                    ))
                                ) : (
                                    <div className="alert alert-warning text-center">
                                        Nothing found !
                                    </div>
                                )
                            }
                        </div>
                    </div>
                )
            }
        </React.Fragment>
    );
};

export default ChatRoom;
