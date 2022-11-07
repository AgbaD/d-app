pragma solidity ^0.5.0;

import "./Token.sol";

contract BelSwap {
    string public name = "BelSwap Instant Exchange";
    Token public token;
    // Etherium to token exchange rate
    // 50 tokens to one etherium
    uint public rate = 50;

    constructor(Token _token) public {
        token = _token;
    }

    function buyTokens() public payable {
        // amount of token to buy based on etherium rate
        uint tokenAmount = msg.value * rate;
        token.transfer(msg.sender, tokenAmount);
    }
}