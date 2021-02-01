// SPDX-License-Identifier: Unlicense
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./SootToken.sol";

contract SootRegistry {
    struct IncidentReport {
        uint256 id;
        bytes32 name;
        bool isEncrypted;
    }

    event Register(
        uint256 id,
        address _from,
        bytes32 _name,
        string _cid
    );

    // victim > incident
    mapping(address => mapping(uint256 => uint256)) victimToTokenId;

    // molester > victim
    mapping(bytes32 => mapping(uint8 => address)) molesterToVictim;
    mapping(bytes32 => uint8) molesterIncidentCount;

    // all incidents
    mapping(uint256 => IncidentReport) tokenIdToIncident;
    SootToken deployedToken;

    constructor(address _tokenDeployedAddress) public {
        deployedToken = SootToken(
            _tokenDeployedAddress
        );
    }

    event RepeatedAttack(bytes32 indexed _name, address indexed _author);

    // ------------------------------------------------------------
    // Core public functions
    // ------------------------------------------------------------
    function register(
        uint256 tokenId,
        bytes32 _name,
        string memory _cid,
        bool _isEncrypted
    ) public {
        victimToTokenId[msg.sender][getTokenCount()] = tokenId;
        deployedToken.mintToken(msg.sender, tokenId, _cid);
        // add to incidents store
        tokenIdToIncident[tokenId]=IncidentReport(
                tokenId,
                _name,
                _isEncrypted
            ) ;

        // add molesterToVictim item
        uint8 currentMolesterIncidentCount
         = molesterIncidentCount[_name];
        molesterToVictim[_name][currentMolesterIncidentCount] = msg
            .sender;
        uint8 newMolesterCount = uint8(
            SafeMath.add(currentMolesterIncidentCount, 1)
        );
        molesterIncidentCount[_name] = newMolesterCount;

        if (newMolesterCount > 2) {
            emit RepeatedAttack(_name, msg.sender);
        }

        emit Register(
            tokenId,
            msg.sender,
            _name,
            _cid
        );
    }

    // ------------------------------------------------------------
    // View functions
    // ------------------------------------------------------------
    function getNextTokenId() public view returns (uint256) {
        return deployedToken.getCurrentTokenId();
    }

    function getAllReports()
        public
        view
        returns (
            uint256[] memory ids
        )
    {
        uint256 currentVictimIncidentCount = getTokenCount();

        ids = new uint256[](currentVictimIncidentCount);

        for (uint256 i = 0; i < currentVictimIncidentCount; i++) {
            uint256 currentIncidentId = victimToTokenId[msg.sender][i];
            ids[i] = currentIncidentId;
        }
        return (ids);
    }

    function getAllVictimsOnMolester(bytes32 _name)
        public
        view
        returns (address[] memory victims)
    {
        uint8 currentMolesterIncidentCount
         = molesterIncidentCount[_name];
        victims = new address[](currentMolesterIncidentCount);

        for (uint8 i = 0; i < currentMolesterIncidentCount; i++) {
            victims[i] = molesterToVictim[_name][i];
        }

        return victims;
    }

    function getIncident(uint256 tokenId)
        public
        view
        returns (
            bytes32 name,
            bool isEncrypted,
            string memory cid
        )
    {
        IncidentReport memory item = tokenIdToIncident[tokenId];
        string memory tokenURI = deployedToken.tokenURI(tokenId);

        return (
            item.name,
            item.isEncrypted,
            tokenURI
        );
    }

    function getTokenCount() public view returns (uint) {
        return deployedToken.balanceOf(msg.sender);
    }

    // ------------------------------------------------------------
    // Private functions
    // ------------------------------------------------------------
    function _stringToBytes32(string memory source)
        private
        pure
        returns (bytes32 result)
    {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }
        // solium-disable security/no-inline-assembly
        assembly {
            result := mload(add(source, 32))
        }
    }
}
