// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HelpToken is ERC20, Ownable {
    string private _tokenImage;
    string private _tokenDescription;

    constructor(
        uint256 initialSupply,
        string memory initialImage,
        string memory initialDescription
    )
        ERC20("HelpToken", "HELP")
        Ownable(msg.sender) // ✅ pass the deployer as the initial owner
    {
        _mint(msg.sender, initialSupply);
        _tokenImage = initialImage;
        _tokenDescription = initialDescription;
    }

    function updateMetadata(string memory newImage, string memory newDescription) external onlyOwner {
        _tokenImage = newImage;
        _tokenDescription = newDescription;
    }

    function getMetadata() external view returns (string memory image, string memory description) {
        return (_tokenImage, _tokenDescription);
    }
}
