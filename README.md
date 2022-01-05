ERC20 contract with fees and blacklist

///////////////////////////////// Overview //////////////////////////////////

Requirements:

a) Part of the fees taken should be burned, the other part is sent to a fund.
b) Implement blacklisting

Assumptions I made based on these requirements:

-You're ok with me using an ERC20 template, because building from scratch would be a huge waste of time
-You want the fee to be taken out any time the user transfers an amount
-50% of fees should be burned
-The blacklist feature is intended to prevent transfer to certain accounts

Shortcuts I took to keep things simple for this example:

-Blacklisting can only be toggled by the owner, and only checked by attempting to transfer to a blacklisted account.
-Fees and treasury account(recipient of 50% of fees) are fixed in the constructor.

//////////////////////////////// Operations /////////////////////////////////

Standard installation with `npm install`

To run functional tests, run: `npx hardhat test` or `npm test`

** It's worth pointing out that one of the tests is intended to fail.  It's clearly labeled **