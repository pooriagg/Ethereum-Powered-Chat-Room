import React, { useContext } from "react";

import ShowChats from "./childs/UserChats_ShowChats";
import ConnectWallet from "./childs/UserChats_ConnectWallet";

import Context from "../context/Context";


const UserChats: React.FunctionComponent<{ connect: Function }> = ({ connect }): JSX.Element => {
    const { userAccount } = useContext(Context);


    return (
        <React.Fragment>
            {
                userAccount ? (
                    <ShowChats />
                ) : (
                    <ConnectWallet connect={connect} />
                )
            }
        </React.Fragment>
    );
};

export default UserChats;