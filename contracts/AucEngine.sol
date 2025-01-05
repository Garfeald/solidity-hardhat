// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract AucEngine {
    address public owner;
    uint constant DURATION = 2 days; // 2 * 24 * 60 * 60 = 172800 sec
    uint constant FEE = 10;
    struct Auction {
        address payable seller;
        uint startingPrice;
        uint finalPrice;
        uint startsAt;
        uint endsAt;
        uint discountRate;
        string item;
        bool stoped;
    }

    Auction[] public auctions;

    constructor() {
        owner = msg.sender;
    }

    function createAuction(
        uint _startingPrice,
        uint _discountRate,
        string calldata _item,
        uint _duration
    ) external {
        uint duration = _duration == 0 ? DURATION : _duration;

		require(_startingPrice >= _discountRate * duration, "incorrect starting price");

		Auction memory newAuction({});
    };
}
