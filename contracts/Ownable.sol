// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract Ownable {
    address public owner;

    constructor(address ownerOverride) {
        owner = ownerOverride == address(0) ? msg.sender : ownerOverride;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "not an owner!");
        _;
    }
}
