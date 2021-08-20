import { expect } from 'chai'
import { getBalance } from './utils'

const Token = artifacts.require("./Token")

contract('Token', accounts => {
  let token

  beforeEach(async () => {
    token = await Token.new()
  })

  it('has default values', async () => {
    await token.name().should.eventually.eq('Test token')
    await token.symbol().should.eventually.eq('TEST')
    await token.decimals().should.eventually.eq('18')
    await token.totalSupply().should.eventually.eq('0')
  })

  it('can be minted', async () => {
    await token.mint().should.be.rejected

    await token.mint({ value: 23 })
    await token.balanceOf(accounts[0]).should.eventually.eq('23')
    await token.totalSupply().should.eventually.eq('23')

    await token.mint({ value: 50 })
    await token.balanceOf(accounts[0]).should.eventually.eq('73')
    await token.totalSupply().should.eventually.eq('73')

    await getBalance(token.address).should.eventually.eq('73')

    await token.mint({ value: 50, from: accounts[1] })
    await token.balanceOf(accounts[0]).should.eventually.eq('73')
    await token.balanceOf(accounts[1]).should.eventually.eq('50')
    await token.totalSupply().should.eventually.eq('123')

    await getBalance(token.address).should.eventually.eq('123')
  })

  it('can be burnt', async () => {
    await token.mint({ value: '23' })
    await token.mint({ value: '50', from: accounts[1] })

    await getBalance(token.address).should.eventually.eq('73')

    const preBal = await getBalance(accounts[9])

    await token.burn(accounts[9])
    await getBalance(token.address).should.eventually.eq('50')

    const postBal = await getBalance(accounts[9])

    expect(postBal.sub(preBal)).to.eq(23)
  })

  describe('once minted', () => {
    beforeEach(async () => {
      await token.mint({ value: 50 })
      await token.mint({ from: accounts[1], value: 50 })
    })

    it('can be transferred directly', async () => {
      await token.transfer(accounts[2], 1, { from: accounts[1] })
      await token.balanceOf(accounts[1]).should.eventually.eq('49')
      await token.balanceOf(accounts[2]).should.eventually.eq('1')
      await token.totalSupply().should.eventually.eq('100')

      await token.transfer(accounts[1], 2, { from: accounts[2] }).should.be.rejected
    })

    it('can be transferred indirectly', async () => {
      await token.approve(accounts[1], 5)
      await token.allowance(accounts[0], accounts[1]).should.eventually.eq(5)

      await token.approve(accounts[1], 10)
      await token.allowance(accounts[0], accounts[1]).should.eventually.eq(10)

      await token.transferFrom(accounts[0], accounts[2], 11, { from: accounts[1] }).should.be.rejected
      await token.transferFrom(accounts[0], accounts[2], 9, { from: accounts[1] })

      await token.balanceOf(accounts[0]).should.eventually.eq('41')
      await token.balanceOf(accounts[1]).should.eventually.eq('50')
      await token.balanceOf(accounts[2]).should.eventually.eq('9')

      await token.allowance(accounts[0], accounts[1]).should.eventually.eq(1)
      await token.transferFrom(accounts[0], accounts[1], 2, { from: accounts[1] }).should.be.rejected
      await token.transferFrom(accounts[0], accounts[1], 1, { from: accounts[1] })

      await token.balanceOf(accounts[0]).should.eventually.eq('40')
      await token.balanceOf(accounts[1]).should.eventually.eq('51')
      await token.balanceOf(accounts[2]).should.eventually.eq('9')

      await token.allowance(accounts[0], accounts[1]).should.eventually.eq(0)
    })

    describe('can record dividends', () => {
      it('and disallows empty dividend', async () => {
        await token.recordDividend().should.be.rejected
      })
      
      it('and keeps track of holders when minting and burning', async () => {
        await token.mint({ value: 100, from: accounts[2] })
        await token.burn(accounts[9])

        await token.balanceOf(accounts[0]).should.eventually.eq('0')
        await token.balanceOf(accounts[1]).should.eventually.eq('50')
        await token.balanceOf(accounts[2]).should.eventually.eq('100')

        await token.recordDividend({ from: accounts[5], value: 1500 })

        await token.getWithdrawableDividend(accounts[0]).should.eventually.eq(0)
        await token.getWithdrawableDividend(accounts[1]).should.eventually.eq(500)
        await token.getWithdrawableDividend(accounts[2]).should.eventually.eq(1000)
      })

      it('and keeps track of holders when transferring', async () => {
        await token.transfer(accounts[2], 25)
        await token.transfer(accounts[3], 0)

        await token.approve(accounts[0], 50, { from: accounts[1] })
        await token.transferFrom(accounts[1], accounts[2], 50)

        await token.balanceOf(accounts[0]).should.eventually.eq('25')
        await token.balanceOf(accounts[1]).should.eventually.eq('0')
        await token.balanceOf(accounts[2]).should.eventually.eq('75')
        await token.balanceOf(accounts[3]).should.eventually.eq('0')

        await token.recordDividend({ from: accounts[5], value: 1000 })

        await token.getWithdrawableDividend(accounts[0]).should.eventually.eq(250)
        await token.getWithdrawableDividend(accounts[1]).should.eventually.eq(0)
        await token.getWithdrawableDividend(accounts[2]).should.eventually.eq(750)
        await token.getWithdrawableDividend(accounts[3]).should.eventually.eq(0)
      })

      it('and compounds the payouts', async () => {
        await token.transfer(accounts[2], 25)

        await token.balanceOf(accounts[0]).should.eventually.eq('25')
        await token.balanceOf(accounts[1]).should.eventually.eq('50')
        await token.balanceOf(accounts[2]).should.eventually.eq('25')

        await token.recordDividend({ from: accounts[5], value: 1000 })

        await token.getWithdrawableDividend(accounts[0]).should.eventually.eq(250)
        await token.getWithdrawableDividend(accounts[1]).should.eventually.eq(500)
        await token.getWithdrawableDividend(accounts[2]).should.eventually.eq(250)

        // do some transfer to update the proportional holdings
        await token.transfer(accounts[2], 25, { from: accounts[1] })

        await token.balanceOf(accounts[0]).should.eventually.eq('25')
        await token.balanceOf(accounts[1]).should.eventually.eq('25')
        await token.balanceOf(accounts[2]).should.eventually.eq('50')

        await token.recordDividend({ from: accounts[5], value: 80 })

        // check that new payouts are in accordance with new holding proportions
        await token.getWithdrawableDividend(accounts[0]).should.eventually.eq(250 + 20)
        await token.getWithdrawableDividend(accounts[1]).should.eventually.eq(500 + 20)
        await token.getWithdrawableDividend(accounts[2]).should.eventually.eq(250 + 40)
      })

      it('and allows for withdrawals in-between payouts', async () => {
        await token.transfer(accounts[2], 25)

        await token.balanceOf(accounts[0]).should.eventually.eq('25')
        await token.balanceOf(accounts[1]).should.eventually.eq('50')
        await token.balanceOf(accounts[2]).should.eventually.eq('25')

        await token.recordDividend({ from: accounts[5], value: 1000 })

        await token.getWithdrawableDividend(accounts[0]).should.eventually.eq(250)
        await token.getWithdrawableDividend(accounts[1]).should.eventually.eq(500)
        await token.getWithdrawableDividend(accounts[2]).should.eventually.eq(250)

        // check that withdrawal works!
        const preBal = await getBalance(accounts[9])
        await token.withdrawDividend(accounts[9], { from: accounts[1]} )
        const postBal = await getBalance(accounts[9])
        expect(postBal.sub(preBal)).to.eq(500)

        // check that withdrawable balance has been reset for account 1
        await token.getWithdrawableDividend(accounts[0]).should.eventually.eq(250)
        await token.getWithdrawableDividend(accounts[1]).should.eventually.eq(0)
        await token.getWithdrawableDividend(accounts[2]).should.eventually.eq(250)

        await token.recordDividend({ from: accounts[5], value: 80 })

        await token.getWithdrawableDividend(accounts[0]).should.eventually.eq(250 + 20)
        await token.getWithdrawableDividend(accounts[1]).should.eventually.eq(0 + 40)
        await token.getWithdrawableDividend(accounts[2]).should.eventually.eq(250 + 20)
      })

      it('and allows for withdrawals even after holder relinquishes tokens', async () => {
        await token.transfer(accounts[2], 25)

        await token.balanceOf(accounts[0]).should.eventually.eq('25')
        await token.balanceOf(accounts[1]).should.eventually.eq('50')
        await token.balanceOf(accounts[2]).should.eventually.eq('25')

        await token.recordDividend({ from: accounts[5], value: 1000 })

        await token.getWithdrawableDividend(accounts[0]).should.eventually.eq(250)
        await token.getWithdrawableDividend(accounts[1]).should.eventually.eq(500)
        await token.getWithdrawableDividend(accounts[2]).should.eventually.eq(250)

        const preBal = await getBalance(accounts[9])

        // burn tokens
        await token.burn(accounts[9], { from: accounts[1] })

        await token.getWithdrawableDividend(accounts[0]).should.eventually.eq(250)
        await token.getWithdrawableDividend(accounts[1]).should.eventually.eq(500)
        await token.getWithdrawableDividend(accounts[2]).should.eventually.eq(250)

        // try withdrawing
        await token.withdrawDividend(accounts[9], { from: accounts[1] })

        // check dest balances
        const postBal = await getBalance(accounts[9])
        expect(postBal.sub(preBal)).to.eq(50 + 500)

        await token.getWithdrawableDividend(accounts[0]).should.eventually.eq(250)
        await token.getWithdrawableDividend(accounts[1]).should.eventually.eq(0)
        await token.getWithdrawableDividend(accounts[2]).should.eventually.eq(250)

        // record new dividend
        await token.recordDividend({ from: accounts[5], value: 80 })

        // this time accounts[1] doesn't get any payout because they no longer hold tokens
        await token.getWithdrawableDividend(accounts[0]).should.eventually.eq(250 + 40)
        await token.getWithdrawableDividend(accounts[1]).should.eventually.eq(0)
        await token.getWithdrawableDividend(accounts[2]).should.eventually.eq(250 + 40)
      })
    })
  })
})