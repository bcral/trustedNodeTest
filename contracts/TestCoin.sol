// ERC20 token with fees and blacklisting

// Assumptions: 
// -You're ok with me using an ERC20 template, because building from scratch would
// be a huge waste of time
// -You want the fee to be taken out any time the user transfers an amount
// -50% of fees should be burned
// -The blacklist feature is intended
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// Import Ownable from the OpenZeppelin Contracts library
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Make Box inherit from the Ownable contract
contract TestCoin is Ownable, ERC20 {

    // mapping of blacklisted users
    mapping(address => bool) blacklist;
    // tax rate as a percentage - set in constructor
    uint256 tax;
    address treasury;
    uint256 WAD = 10**18;

    constructor(address _treasury) ERC20("TestCoin for trustedNode", "TEST") {
        // Tax is only set once.  Could be made variable in a function, but it's
        // not recommended unless there is a max restriction.
        tax = 10;
        treasury = _treasury;
    }

    modifier checkBlacklist(address user) {
        require(!blacklist[user], "User is blacklisted and cannot be transferred to.");
        _;
    }

// *************************** Utility functions ****************************

    function getTransferAmnt(uint256 amount) private returns(uint256) {
        // calculate fee
        uint256 fee = ((amount * tax) * WAD) / 100;
        // get half of fee for burn amount
        uint256 halfFee = (fee / 2) / WAD;
        // set return amount to the original amount minus all fees
        uint256 remainder = ((amount * WAD) - fee) / WAD;
        // burn 50% of the fee
        _burn(msg.sender, halfFee);
        // transfer remaining fees to treasury address
        super.transfer(treasury, halfFee);

        return(remainder);
    }

    // Owner can toggle user's blacklist status
    function toggleBlacklist(address user) public onlyOwner returns(bool) {
        blacklist[user] = !blacklist[user];
        return blacklist[user];
    }

    function mint(address minter, uint256 amount) public onlyOwner {
        _mint(minter, amount);
    }


// ******* ERC20 overriding functions(using underlying ERC20 contract) *******

    // Overriding transfer function that takes fee before transfer
    function transfer(address recipient, uint256 amount)
        public 
        virtual 
        override 
        checkBlacklist(recipient)
        returns (bool) {
        // Handle fee calculations and transfers, returning new transfer amount
        uint256 remainder = getTransferAmnt(amount);
        // Transfer return value from handling function
        super.transfer(recipient, remainder);
        return true;
    }

    // Overriding transferFrom function that takes fee before transfer
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    )   public 
        virtual 
        override 
        checkBlacklist(recipient)
        returns (bool) {
        // Handle fee calculations and transfers, returning new transfer amount
        uint256 remainder = getTransferAmnt(amount);
        // Transfer return value from handling function
        super.transferFrom(sender, recipient, remainder);
        return true;
    }
}