// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GameCharacterCollectionERC1155 is ERC1155, Ownable {
    uint256 public constant MIN_ID = 1;
    uint256 public constant MAX_ID = 10;

    bool public initialCollectionMinted;
    mapping(uint256 => string) private _tokenURIs;

    error Characters_InvalidId(uint256 tokenId);
    error Characters_InitialAlreadyMinted();

    constructor(string[10] memory characterTokenUris) ERC1155("") {
        for (uint256 i = 0; i < 10; i++) {
            _tokenURIs[i + 1] = characterTokenUris[i];
        }
    }

    function uri(uint256 id) public view override returns (string memory) {
        _requireValidId(id);
        return _tokenURIs[id];
    }

    function setTokenURI(uint256 id, string calldata newUri) external onlyOwner {
        _requireValidId(id);
        _tokenURIs[id] = newUri;
        emit URI(newUri, id);
    }

    function mintInitialCollection(address to) external onlyOwner {
        if (initialCollectionMinted) revert Characters_InitialAlreadyMinted();
        initialCollectionMinted = true;

        uint256[] memory ids = new uint256[](10);
        uint256[] memory amounts = new uint256[](10);
        for (uint256 i = 0; i < 10; i++) {
            ids[i] = i + 1;
            amounts[i] = 1;
        }

        _mintBatch(to, ids, amounts, "");
    }

    function mintBatch(
        address to,
        uint256[] calldata ids,
        uint256[] calldata amounts,
        bytes calldata data
    ) external onlyOwner {
        for (uint256 i = 0; i < ids.length; i++) {
            _requireValidId(ids[i]);
        }
        _mintBatch(to, ids, amounts, data);
    }

    function _requireValidId(uint256 id) internal pure {
        if (id < MIN_ID || id > MAX_ID) revert Characters_InvalidId(id);
    }
}


