// SPDX-License-Identifier: Unlicense
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721//ERC721.sol";

contract SootToken is ERC721 {
  uint256 private currentTokenId;

  constructor() public ERC721('SootToken', 'SOT'){
    currentTokenId = 1;
  }

  function mintToken(address ownerAddress, uint256 tokenId, string memory cid) public {
    _safeMint(ownerAddress, tokenId);
    _setTokenURI(tokenId, cid);
    _increaseTokenId();
  }

  function getCurrentTokenId() public view returns(uint){
    return currentTokenId;
  }

  function _increaseTokenId() private {
    currentTokenId = currentTokenId + 1;
  }

  function _setTokenURI(uint256 tokenId, string memory tokenURI)
    internal
    override
  {
      super._setTokenURI(tokenId, tokenURI);
  }
}
