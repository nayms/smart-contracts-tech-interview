pragma solidity 0.7.0;

import "./IERC20.sol";
import "./IMintableToken.sol";
import "./IDividends.sol";
import "./SafeMath.sol";

contract Token is IERC20, IMintableToken, IDividends {
  // ------------------------------------------ //
  // ----- BEGIN: DO NOT EDIT THIS SECTION ---- //
  // ------------------------------------------ //
  using SafeMath for uint256;
  uint256 public totalSupply;
  uint256 public decimals = 18;
  string public name = "Test token";
  string public symbol = "TEST";
  mapping (address => uint256) public balanceOf;
  // ------------------------------------------ //
  // ----- END: DO NOT EDIT THIS SECTION ------ //  
  // ------------------------------------------ //

  // IERC20

  function allowance(address owner, address spender) external view override returns (uint256) {
    revert();
  }

  function transfer(address to, uint256 value) external override returns (bool) {
    revert();
  }

  function approve(address spender, uint256 value) external override returns (bool) {
    revert();
  }

  function transferFrom(address from, address to, uint256 value) external override returns (bool) {
    revert();
  }

  // IMintableToken

  function mint() external payable override {
    revert();
  }

  function burn(address payable dest) external override {
    revert();
  }

  // IDividends

  function getNumTokenHolders() external view override returns (uint256) {
    revert();
  }

  function getTokenHolder(uint256 index) external view override returns (address) {
    revert();
  }

  function recordDividend() external payable override {
    revert();
  }

  function getWithdrawableDividend(address payee) external view override returns (uint256) {
    revert();
  }

  function withdrawDividend(address payable dest) external override {
    revert();
  }
}