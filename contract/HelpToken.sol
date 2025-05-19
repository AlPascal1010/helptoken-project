// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract HelpToken is ERC20 {
    address public owner;
    string public imageURL;
    string public description;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() ERC20("HelpToken", "HELP") {
        owner = msg.sender;
        imageURL = "https://ipfs.io/ipfs/bafybeidoe4o4jgo6ktp65z2rxir7yw73aexprmw63qitno674ybcnh2kqa";
        description = "HelpToken powers humanitarian aid networks by enabling fast, borderless donations.";
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    function updateImage(string memory newURL) external onlyOwner {
        imageURL = newURL;
    }

    function updateDescription(string memory newDesc) external onlyOwner {
        description = newDesc;
    }
}
