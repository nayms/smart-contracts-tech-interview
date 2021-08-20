pragma solidity 0.7.0;

interface IMintableToken {
  /**
   * @dev Deposit ETH and mint equal no. of tokens to the caller's balance.
   *
   * Throws error if no ETH is supplied.
   */
  function mint() external payable;

  /**
   * @dev Burn caller's token balance and send the equivalent amount of ETH to given destination address.
   */
  function burn(address payable dest) external;
}