// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "./StringExt.sol";
import "./ArrayExt.sol";

contract LibDemo {
    using StringExt for string;
    using ArrayExt for uint[];

    function runnerStr(
        string memory str1,
        string memory str2
    ) public pure returns (bool) {
        return str1.eq(str2);
        // return StringExt(str1, str2) - можно так
    }

    function runnerArr(uint[] memory arr, uint el) public pure returns (bool) {
        return arr.inArray(el);
        // return StringExt(str1, str2) - можно так
    }
}
