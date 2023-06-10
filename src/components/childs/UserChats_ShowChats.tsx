import React, { useState, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ScaleLoader } from "react-spinners";

import Context from "../../context/Context";
import { chatHttps, deployedBlock } from "../../helpers/ChatContractData";


const ShowChats: React.FunctionComponent = (): JSX.Element => {
    type userChatsStatus = Map<string, { latestMsg: string, time: number }>;

    const [ loading, setLoading ] = useState<boolean>(true);
    const [ chats, setChats ] = useState<userChatsStatus>();

    const { userAccount, web3Http } = useContext(Context);

    useEffect(() => {
        if (userAccount) {
            let chatData: userChatsStatus = new Map();

            const Options = {
                fromBlock: deployedBlock,
                toBlock: "latest",
                filter: {
                    to: userAccount
                }
            };
    
            chatHttps.getPastEvents("Message", Options, async (error, events) => {
                if (!error) {
                    for (const { returnValues: { from, message }, blockNumber } of events) {
                        if (!chatData.has(from)) {
                            chatData.set(from, { latestMsg: "", time: 0 });
                        };

                        const { timestamp } = await web3Http?.eth.getBlock(blockNumber)!;

                        chatData.set(from, { latestMsg: message, time: Number(timestamp) });
                    };

                    setChats(chatData);
                    setLoading(false);
                } else {
                    toast.error("Falied to load user chats !", {
                        toastId: "Falied to load user chats"
                    });
                };
            });
        };
    }, [ userAccount, web3Http ]);

    const trimAddress = useCallback((addr: string) => {
        return `${addr.slice(0, 7)}.....${addr.slice(-7)}`;
    }, []);
    

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
                    <div className="col-6 mx-auto mt-5">
                        <div className="card">
                            <div className="card-header text-center">
                                Your Latest Chats
                            </div>

                            <div className="card-body">
                                <table className="table text-center">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>From</th>
                                            <th>Latest-Message</th>
                                            <th>Time</th>
                                            <th>Chat</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            Array.from(chats!).map(([ from, data ], index) => (
                                                <tr key={index}>
                                                    <th>{ index + 1 }</th>
                                                    <td title={from}>{ trimAddress(from) }</td>
                                                    <td>{ data.latestMsg }</td>
                                                    <td>{ (new Date(data.time * 1000)).toLocaleString() }</td>
                                                    <td>
                                                        <Link to={`/chatroom/${from}`}>start</Link>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>  
                    </div>
                )
            }
        </React.Fragment>
    );
};

export default ShowChats;