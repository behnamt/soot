// SPDX-License-Identifier: Unlicense
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./SootToken.sol";

contract SootRegistry {
    struct IncidentReport {
        uint256 id;
        bytes32 name;
        bool isEncrypted;
        int256 latitude;
        int256 longitude;
        uint256 date;
        address author;
    }

    event Register(
        uint256 id,
        address _from,
        bytes32 _name,
        string _cid,
        bool _isEncrypted,
        int256 _latitude,
        int256 _longitude,
        uint256 _date
    );

    // victim > incident
    mapping(address => mapping(uint256 => uint256)) victimToTokenId;
    // mapping(address => uint8) victimIncidentCount;

    // molester > victim
    mapping(bytes32 => mapping(uint8 => address)) molesterToVictim;
    mapping(bytes32 => uint8) molesterIncidentCount;

    // all incidents
    IncidentReport[] incidents;
    SootToken deployedToken;

    constructor(address _tokenDeployedAddress) public {
        deployedToken = SootToken(
            _tokenDeployedAddress
        );
    }

    event RepeatedAttack(bytes32 indexed _name, address indexed _author, uint256 _date);

    // ------------------------------------------------------------
    // Core public functions
    // ------------------------------------------------------------
    function register(
        string memory _name,
        string memory _cid,
        bool _isEncrypted,
        int256 _latitude,
        int256 _longitude,
        uint256 _date
    ) public {
        bytes32 _transformedName = _stringToBytes32(_name);

        uint tokenId = deployedToken.getCurrentTokenId();
        victimToTokenId[msg.sender][getTokenCount()] = tokenId;
        deployedToken.mintToken(msg.sender, tokenId, _cid);
        // add to incidents store
        incidents.push(
            IncidentReport(
                tokenId,
                _transformedName,
                _isEncrypted,
                _latitude,
                _longitude,
                _date,
                msg.sender
            )
        );


        // add victimToTokenId item
        // uint8 currentVictimIncidentCount = victimIncidentCount[msg.sender];
        
        // victimIncidentCount[msg.sender] = uint8(
        //     SafeMath.add(currentVictimIncidentCount, 1)
        // );

        // add molesterToVictim item

            uint8 currentMolesterIncidentCount
         = molesterIncidentCount[_transformedName];
        molesterToVictim[_transformedName][currentMolesterIncidentCount] = msg
            .sender;
        uint8 newMolesterCount = uint8(
            SafeMath.add(currentMolesterIncidentCount, 1)
        );
        molesterIncidentCount[_transformedName] = newMolesterCount;

        if (newMolesterCount > 2) {
            emit RepeatedAttack(_transformedName, msg.sender, _date);
        }

        emit Register(
            tokenId,
            msg.sender,
            _transformedName,
            _cid,
            _isEncrypted,
            _latitude,
            _longitude,
            _date
        );

        // update counters
        // incidents_size++;
    }

    // function updateCidOfIncident(uint256 _id, bytes32 _cid) public {
    //     incidents[_id].cid = _cid;
    // }

    // ------------------------------------------------------------
    // View functions
    // ------------------------------------------------------------
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

    // function getAllVictimsOnMolester(string memory _name)
    //     public
    //     view
    //     returns (address[] memory victims)
    // {
    //     bytes32 _transformedName = _stringToBytes32(_name);


    //         uint8 currentMolesterIncidentCount
    //      = molesterIncidentCount[_transformedName];
    //     victims = new address[](currentMolesterIncidentCount);

    //     for (uint8 i = 0; i < currentMolesterIncidentCount; i++) {
    //         victims[i] = molesterToVictim[_transformedName][i];
    //     }

    //     return victims;
    // }

    // function getAllIncidents()
    //     public
    //     view
    //     returns (
    //         uint256[] memory ids,
    //         bytes32[] memory names,
    //         int256[] memory latitudes,
    //         int256[] memory longitudes,
    //         bool[] memory isEncrypteds
    //     )
    // {
    //     ids = new uint256[](incidents_size);
    //     names = new bytes32[](incidents_size);
    //     latitudes = new int256[](incidents_size);
    //     longitudes = new int256[](incidents_size);
    //     isEncrypteds = new bool[](incidents_size);

    //     for (uint256 i = 0; i < incidents_size; i++) {
    //         IncidentReport memory incident = incidents[i];
    //         ids[i] = incident.id;
    //         names[i] = incident.name;
    //         latitudes[i] = incident.latitude;
    //         longitudes[i] = incident.longitude;
    //         isEncrypteds[i] = incident.isEncrypted;
    //     }
    //     return (ids, names, latitudes, longitudes, isEncrypteds);
    // }

    // function getIncident(uint256 id)
    //     public
    //     view
    //     returns (
    //         bytes32 name,
    //         int256 latitude,
    //         int256 longitude,
    //         bytes32 cid,
    //         bool isEncrypted,
    //         uint256 date,
    //         address author
    //     )
    // {
    //     return (
    //         incidents[id].name,
    //         incidents[id].latitude,
    //         incidents[id].longitude,
    //         incidents[id].cid,
    //         incidents[id].isEncrypted,
    //         incidents[id].date,
    //         incidents[id].author
    //     );
    // }

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
