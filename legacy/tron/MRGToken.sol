// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title MRGToken
 * @dev TRC20-compatible token for the TRON network.
 *
 * Deploy with `initialSupply` as whole MRG tokens. For example, passing
 * 1000000000 mints 1,000,000,000 MRG with 18 decimals to the deployer.
 */
contract MRGToken {
    string public constant name = "MergeOS";
    string public constant symbol = "MRG";
    uint8 public constant decimals = 18;

    uint256 private _totalSupply;
    address private _owner;

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == _owner, "MRG: caller is not the owner");
        _;
    }

    constructor(uint256 initialSupply) {
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);

        _mint(msg.sender, initialSupply * 10 ** uint256(decimals));
    }

    function owner() external view returns (address) {
        return _owner;
    }

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    }

    function transfer(address recipient, uint256 amount) external returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function allowance(address tokenOwner, address spender) external view returns (uint256) {
        return _allowances[tokenOwner][spender];
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool) {
        uint256 currentAllowance = _allowances[sender][msg.sender];
        require(currentAllowance >= amount, "MRG: transfer amount exceeds allowance");

        _transfer(sender, recipient, amount);
        _approve(sender, msg.sender, currentAllowance - amount);

        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) external returns (bool) {
        _approve(msg.sender, spender, _allowances[msg.sender][spender] + addedValue);
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) external returns (bool) {
        uint256 currentAllowance = _allowances[msg.sender][spender];
        require(currentAllowance >= subtractedValue, "MRG: decreased allowance below zero");

        _approve(msg.sender, spender, currentAllowance - subtractedValue);
        return true;
    }

    function mint(address account, uint256 amount) external onlyOwner returns (bool) {
        _mint(account, amount);
        return true;
    }

    function burn(uint256 amount) external returns (bool) {
        _burn(msg.sender, amount);
        return true;
    }

    function burnFrom(address account, uint256 amount) external returns (bool) {
        uint256 currentAllowance = _allowances[account][msg.sender];
        require(currentAllowance >= amount, "MRG: burn amount exceeds allowance");

        _approve(account, msg.sender, currentAllowance - amount);
        _burn(account, amount);

        return true;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "MRG: new owner is the zero address");

        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }

    function renounceOwnership() external onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    function _transfer(address sender, address recipient, uint256 amount) private {
        require(sender != address(0), "MRG: transfer from the zero address");
        require(recipient != address(0), "MRG: transfer to the zero address");

        uint256 senderBalance = _balances[sender];
        require(senderBalance >= amount, "MRG: transfer amount exceeds balance");

        _balances[sender] = senderBalance - amount;
        _balances[recipient] += amount;

        emit Transfer(sender, recipient, amount);
    }

    function _mint(address account, uint256 amount) private {
        require(account != address(0), "MRG: mint to the zero address");

        _totalSupply += amount;
        _balances[account] += amount;

        emit Transfer(address(0), account, amount);
    }

    function _burn(address account, uint256 amount) private {
        require(account != address(0), "MRG: burn from the zero address");

        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "MRG: burn amount exceeds balance");

        _balances[account] = accountBalance - amount;
        _totalSupply -= amount;

        emit Transfer(account, address(0), amount);
    }

    function _approve(address tokenOwner, address spender, uint256 amount) private {
        require(tokenOwner != address(0), "MRG: approve from the zero address");
        require(spender != address(0), "MRG: approve to the zero address");

        _allowances[tokenOwner][spender] = amount;

        emit Approval(tokenOwner, spender, amount);
    }
}
