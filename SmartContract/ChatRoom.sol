// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;

contract ChatRoom {
    event Message(
        address indexed to,
        address indexed from,
        string message
    );

    function sendMessage(
        address _to,
        string calldata _message
    ) external {
        require(
            _to != address(0) &&
            _to != msg.sender,
            "Invalid recepient address."
        );
        require(bytes(_message).length > 0, "Please enter a message!");

        emit Message({
            to: _to,
            from: msg.sender,
            message: _message
        });
    }
}