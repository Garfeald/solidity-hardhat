// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

library ArrayExt {
    function inArray(uint[] memory arr, uint el) internal pure returns (bool) {
        for (uint i = 0; i < arr.length; i++) {
            if (arr[i] == el) {
                return true;
            }
        }

        return false;
    }
}
