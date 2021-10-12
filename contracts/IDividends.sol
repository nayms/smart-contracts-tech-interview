pragma solidity 0.7.0;

interface IDividends {
  /**
   * Get the no. of token holders with non-zero balance.
   *
   * @return no. of token holders with non-zero balance.
   */
  function getNumTokenHolders() external view returns (uint256);

  /**
   * Get the address at the given index in the list of token holders with a non-zero balance.
   *
   * @param index the 1-based index into the list of holders.
   *
   * @return the address, or the null adress if the index is out of bounds.
   */
  function getTokenHolder(uint256 index) external view returns (address);

  /**
   * Record a new dividend to be paid to all current token holders.
   *
   * Dividend amount equals `msg.value`.
   *
   * Each token holder should be assigned a percentage of dividend according 
   * to their proportion of the token supply.
   *
   * Throws an error if no ETH is supplied.
   */
  function recordDividend() external payable;

  /**
   * Get current withdrawable dividend for given payee.
   *
   * @return the withdrawable dividend.
   */
  function getWithdrawableDividend(address payee) external view returns (uint256);

  /**
   * Withdraw dividend assigned to caller to given destination address.
   *
   * The dividend ETH will be transferred to the caller and the internal dividend balance set to 0.
   */
  function withdrawDividend(address payable dest) external;
}