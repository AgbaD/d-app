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

    describe('BuyTokens()', async () => {
        let result;

        // purchase token before running tests
        before(async() => {
            result = await belSwap.buyTokens({from: investor, value: web3.utils.toWei('1', 'ether')})
        })
        it('users should be able to buy token from BelSwap', async () => {
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('100'))

            let belSwapBalance = await token.balanceOf(belSwap.address)
            assert.equal(belSwapBalance.toString(), tokens('999900'))
            belSwapBalance = await web3.eth.getBalance(belSwap.address)
            assert.equal(belSwapBalance.toString(), web3.utils.toWei('1', 'ether'))

            const event = result.logs[0].args
            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.amount, tokens('100').toString())
            assert.equal(event.rate.toString(), '100')
        })
    })

    describe('SellTokens()', async () => {
        let result;

        // purchase token before running tests
        before(async() => {
            // investor must approve purchase
            // must allow exchange to spend on their behals
            await token.approve(belSwap.address, tokens('100'), {from: investor})
            result = await belSwap.sellTokens(tokens('100'), {from: investor})
        })
        it('users should be able to sell token to BelSwap', async () => {
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('0'))

            let belSwapBalance = await token.balanceOf(belSwap.address)
            assert.equal(belSwapBalance.toString(), tokens('1000000'))
            belSwapBalance = await web3.eth.getBalance(belSwap.address)
            assert.equal(belSwapBalance.toString(), web3.utils.toWei('0', 'ether'))

            const event = result.logs[0].args
            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.amount, tokens('100').toString())
            assert.equal(event.rate.toString(), '100')
        })
    })

})
