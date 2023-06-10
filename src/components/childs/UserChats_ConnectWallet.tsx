import React, { useState } from "react";


const ConnectWallet: React.FunctionComponent<{ connect: Function }> = ({ connect }): JSX.Element => {
    const [ loading, setLoading ] = useState<boolean>(false);


    return (
        <React.Fragment>
            <div className="col-5 mx-auto shadow my-5">
                <div className="alert alert-info text-center">
                    <p>Please click to connect your wallet to the chat dapp</p>
                    
                    <button className="btn btn-primary" onClick={async () => {
                        setLoading(true);
                        await connect();
                        setLoading(false);
                    }}>
                        {
                            !loading ? ("Connect") : ("Connecting...")
                        }
                    </button>
                </div>
            </div>
        </React.Fragment>
    );
};

export default ConnectWallet;