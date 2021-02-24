// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./AbdulTokenInterface.sol";

contract AbdulToken is TokenInterface {
    mapping(address => uint256) private balances;

    mapping(address => mapping(address => uint256)) private allowances;

    uint256 private _totalSupply;

    string public name;
    uint8 public decimal;
    string public symbol;

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimal,
        uint256 _initialAmount
    ) {
        name = _name;
        symbol = _symbol;
        decimal = _decimal;
        balances[msg.sender] = _initialAmount;
        _totalSupply = _initialAmount;
    }

    function totalSupply() public virtual view override returns (uint256) {
        return _totalSupply;
    }

    function transfer(address recipient, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        require(balances[msg.sender] >= amount, "Insufficeint funds");
        balances[msg.sender] -= amount;
        balances[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);

        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public virtual override returns (bool) {
        uint256 currentAllowance = allowances[sender][msg.sender];

        require(sender != address(0), "transfer from the zero address");
        require(recipient != address(0), "transfer from the zero address");
        require(amount <= balances[sender], "Insufficeint funds");
        require(currentAllowance >= amount, "Tranfer amount exceeds allowance");

        balances[sender] -= amount;
        balances[recipient] += amount;
        currentAllowance - amount;

        emit Transfer(sender, recipient, amount);

        return true;
    }

    function approve(address spender, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        require(spender != address(0), "approve from the zero address");

        allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);

        return true;
    }

    function allowance(address owner, address spender)
        public
        view
        virtual
        override
        returns (uint256)
    {
        return allowances[owner][spender];
    }

    function balanceOf(address account) public view virtual override returns (uint256) {
        return balances[account];
    }

    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "Mint to the zero address");

        _totalSupply += amount;
        balances[account] += amount;

        emit Transfer(address(0), account, amount);
    }

    function _burn(address account, uint256 amount) internal virtual {
        require(account != address(0), "burn from the zero address");

        uint256 accountBalance = balances[account];
        require(accountBalance >= amount, "burn amount exceeds balance");
        balances[account] = accountBalance - amount;
        _totalSupply -= amount;

        emit Transfer(account, address(0), amount);
    }
}
