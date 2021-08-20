# Tech interview smart contracts coding problem

This is a Solidity coding problem for [Nayms](https://nayms.io) tech interviews. It is designed to take **no more than a few hours**.

## Getting setup

Ensure you have installed:

* NodeJS 14+
* Yarn (_install using `npm i -g yarn`_)

## Instructions

### Part 1: Setup

Clone the repo locally and install the NPM dependencies using:

```shell
yarn
```

### Part 2: Complete the task

The contracts consist of a mintable ERC-20 `Token` (which is similar to a _Wrapped ETH_ token). Callers mint tokens by depositing ETH. They can then burn their token balance to get the equivalent amount of deposited ETH back.

In addition, token holders can receive dividend payments in ETH in proportion to their token balance relative to the total supply.

Dividend payments are assigned to token holders' addresses. This means that even if a token holder were to send their tokens to somebody else later on or burn their tokens, they would still be entitled to the dividends they accrued whilst they were holding the tokens.

For a clearer understanding of how the code is supposed to work please refer to the tests in the `test` folder.

**You only need to write code in the `Token.sol` file. The task is complete once all the unit tests pass successfully.**

### Part 3: BONUS!

The dividends payment process requires looping through token holders. If the no. of holders is very large (e.g. >1000) it's likely that the `recordDividend()` method will fail (due to out-of-gas error). Come up with another way of paying dividends that does not suffer from this issue.

Outline in writing (or code!) how you would do things differently. Create a `Token2.sol` file with your new code and add new unit tests too if you like!

### Part 4: Send us your code

Please publish your code to a new **private** Github repository and give us ([@hiddentao](https://github.com/hiddentao), [@melks](https://github.com/melks)) read-only permissions to it.

## Commands

* `yarn devnet` - run a local [ganache](https://www.trufflesuite.com/ganache) instance to deploy the contracts to (we recommend keeping this running form the start in a separate tab)
* `yarn compile` - compile the code
* `yarn test` - run the tests
* `yarn deploy` - deploy compiled code to local testnet (in case you want to use Remix, etc)

## License

MIT
