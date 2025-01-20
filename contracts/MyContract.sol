// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "./Ownable.sol";

abstract contract Balances is Ownable {
    function getBalance() public view onlyOwner returns (uint) {
        return address(this).balance;
    }

    function withdraw(address payable _to) public onlyOwner {
        _to.transfer(getBalance());
    }
}

// важен порядок, сначала первый родитель
contract MyContract is Ownable, Balances {
    constructor() Ownable(msg.sender) {}
}
