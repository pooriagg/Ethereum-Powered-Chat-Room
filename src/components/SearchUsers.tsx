import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import Context from "../context/Context";


const StartChatting: React.FunctionComponent = (): JSX.Element => {
    const [ recepient, setRecepient ] = useState<string>();

    const navigate = useNavigate();

    const { web3 } = useContext(Context);


    return (
        <React.Fragment>
            <div className="card col-5 text-center mx-auto">
                <div className="card-header">
                    Search
                </div>

                <div className="card-body">
                    <form className="mb-4">
                        <input type="text" className="form-control my-3" placeholder="Enter recepient" onChange={(e) => {
                            setRecepient(e.target.value);
                        }}/>
                        <button type="button" className="btn btn-primary w-100 mb-2" onClick={() => {
                            if (
                                recepient?.startsWith("0x") &&
                                recepient?.length === 42 &&
                                web3?.utils.isAddress(recepient)
                            ) {
                                navigate(`/chatroom/${recepient}`);
                            } else {
                                toast.warn("Enter a valid ethereum address !", {
                                    toastId: "Enter a valid ethereum address"
                                });
                            };
                        }}>Search</button>
                    </form>
                </div>
            </div>
        </React.Fragment>
    );
};

export default StartChatting;