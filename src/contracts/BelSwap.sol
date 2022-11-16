pragma solidity ^0.5.0;

import "./Token.sol";

contract BelSwap {
    string public name = "BelSwap Instant Exchange";
    Token public token;
    // Etherium to token exchange rate
    // 50 tokens to one etherium
    uint public rate = 100;

    event TokensPurchased(
        address account, 
        address token,
        uint amount,
        uint rate
    );

    event TokensSold(
        address account, 
        address token,
        uint amount,
        uint rate
    );

    constructor(Token _token) public {
        token = _token;
    }

    function buyTokens() public payable {
        // amount of token to buy based on etherium rate
        uint tokenAmount = msg.value * rate;
        require(token.balanceOf(address(this)) >= tokenAmount);
        token.transfer(msg.sender, tokenAmount);

        // emit an event
        emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint _tokenAmount) public {
        // calculate amount of ether to be redeemed
        uint ethAmount = _tokenAmount / rate;
        require(address(this).balance >= ethAmount );
        require(token.balanceOf(msg.sender) >= _tokenAmount);

        token.transferFrom(msg.sender, address(this), _tokenAmount);
        msg.sender.transfer(ethAmount);

        // emit an event
        emit TokensSold(msg.sender, address(token), _tokenAmount, rate);
    }
}