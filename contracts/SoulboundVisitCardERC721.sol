// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SoulboundVisitCardERC721 is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId = 1;
    mapping(address => uint256) public tokenOfStudent;

    error Soulbound_AlreadyMinted(address student);
    error Soulbound_TransfersDisabled();
    error Soulbound_ApprovalsDisabled();

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {}

    function mintVisitCard(address to, string calldata tokenUri) external onlyOwner {
        if (tokenOfStudent[to] != 0) revert Soulbound_AlreadyMinted(to);

        uint256 tokenId = _nextTokenId++;
        tokenOfStudent[to] = tokenId;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenUri);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal override(ERC721) {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
        if (from != address(0)) revert Soulbound_TransfersDisabled();
    }

    function approve(address, uint256) public pure override(ERC721, IERC721) {
        revert Soulbound_ApprovalsDisabled();
    }

    function setApprovalForAll(address, bool) public pure override(ERC721, IERC721) {
        revert Soulbound_ApprovalsDisabled();
    }

    function transferFrom(address, address, uint256) public pure override(ERC721, IERC721) {
        revert Soulbound_TransfersDisabled();
    }

    function safeTransferFrom(address, address, uint256) public pure override(ERC721, IERC721) {
        revert Soulbound_TransfersDisabled();
    }

    function safeTransferFrom(address, address, uint256, bytes memory) public pure override(ERC721, IERC721) {
        revert Soulbound_TransfersDisabled();
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}


