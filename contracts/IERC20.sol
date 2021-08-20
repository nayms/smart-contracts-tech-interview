pragma solidity 0.7.0;

/**
 * See https://eips.ethereum.org/EIPS/eip-20 for interface docs
 */
interface IERC20 {
  function allowance(address owner, address spender) external view returns (uint256);
  function transfer(address to, uint256 value) external returns (bool);
  function approve(address spender, uint256 value) external returns (bool);
  function transferFrom(address from, address to, uint256 value) external returns (bool);
}