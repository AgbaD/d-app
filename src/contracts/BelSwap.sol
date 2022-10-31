pragma solidity ^0.5.0;

import "./Token.sol";

contract BelSwap {
    string public name = "BelSwap Instant Exchange";
    Token public token;

    constructor(Token _token) public {
        token = _token;
    }

    function buyTokens() {
        
    }
}