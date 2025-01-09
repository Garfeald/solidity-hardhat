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
        uint startAt;
        uint endsAt;
        uint discountRate;
        string item;
        bool stoped;
    }

    Auction[] public auctions;

    event AuctionCreated(
        uint index,
        string itemName,
        uint startPrice,
        uint duration
    );

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

        require(
            _startingPrice >= _discountRate * duration,
            "incorrect starting price"
        );

        Auction memory newAuction = Auction({
            seller: payable(msg.sender),
            startingPrice: _startingPrice,
            discountRate: _discountRate,
            finalPrice: _startingPrice,
            startAt: block.timestamp,
            endsAt: block.timestamp + duration,
            item: _item,
            stoped: false
        });

        auctions.push(newAuction);

        emit AuctionCreated(
            auctions.length - 1,
            _item,
            _startingPrice,
            duration
        );
    }
}
