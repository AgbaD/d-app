const { assert } = require('chai');

const Token = artifacts.require("Token");
const BelSwap = artifacts.require("BelSwap");

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('BelSwap', (accounts) => {
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
})
