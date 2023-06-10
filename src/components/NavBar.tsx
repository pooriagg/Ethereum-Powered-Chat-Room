import React from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const NavBar: React.FunctionComponent = (): JSX.Element => {
    return (  
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-5">
            <div className="container">
                <Link to="/" className="navbar-brand">
                    <img src="https://etherscan.io/images/svg/brands/ethereum-original.svg" width="38" height="38" alt="Ethereum" title="Ethereum Chat Dapp"/>
                </Link>
            
                <Link to="/" className="navbar-brand">Ethereum Chat DApp</Link>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to="/search" className="nav-link">Search-User</Link>
                        </li>
                    </ul>
                </div>
            </div>

            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                draggable
                pauseOnHover
                theme="colored"
            />
        </nav>
    );
};

export default NavBar;