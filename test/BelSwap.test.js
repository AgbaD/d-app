const { assert } = require('chai');

const Token = artifacts.require("Token");
const BelSwap = artifacts.require("BelSwap");

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('BelSwap', ([deployer, investor]) => {
    let token, belSwap

    before(async() => {
        token = await Token.new()
        belSwap = await BelSwap.new(token.address)
        await token.transfer(belSwap.address, tokens('1000000'))
    })

    describe('Token Deployment', async () => {
        it('contract should have name', async () => {
            const name = await token.name()
            assert.equal(name, 'BCC Token')
        })
    })

    describe('BelSwap Deployment', async () => {
        it('contract should have name', async () => {
            const name = await belSwap.name()
            assert.equal(name, 'BelSwap Instant Exchange')
        })

        it('exchange should have all the token', async () => {
            let balance = await token.balanceOf(belSwap.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })

    describe('BuyTokens', async () => {
        let result;

        // purchase token before running tests
        before(async() => {
            await belSwap.buyTokens({from: investor, value: tokens('1')})
        })
        it('users should be able to buy token from BwlSwap', async () => {
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('100'))
        })
    })
})
