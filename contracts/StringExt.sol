// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

library StringExt {
    function eq(
        string memory str1,
        string memory str2
    ) internal pure returns (bool) {
        return
            keccak256(abi.encodePacked(str1)) ==
            keccak256(abi.encodePacked(str2));
    }
}
