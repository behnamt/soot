// SPDX-License-Identifier: Unlicense
pragma solidity ^0.6.0;

import "@openzeppelin/contracts-ethereum-package/contracts/access/Ownable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";

contract SootRegistry is Initializable, OwnableUpgradeSafe {
    struct IncidentReport {
        uint256 id;
        bytes32 name;
        bytes32 cid;
        bool isEncrypted;
        int256 lat;
        int256 lon;
        uint256 date;
        address author;
    }

    // victim > incident
    mapping(address => mapping(uint8 => uint256)) victimToIncidentId;
    mapping(address => uint8) victimIncidentCount;

    // molester > victim
    mapping(bytes32 => mapping(uint8 => address)) molesterToVictim;
    mapping(bytes32 => uint8) molesterIncidentCount;

    // all incidents
    IncidentReport[] incidents;
    uint256 incidents_size = 0;

    function initialize() public initializer {
        __Ownable_init();
    }

    event Register(
        uint256 id,
        address _from,
        bytes32 _name,
        bytes32 _cid,
        bool _isEncrypted,
        int256 _lat,
        int256 _lon,
        uint256 _date
    );

    event RepeatedAttack(bytes32 indexed _name, address indexed _author, uint256 _date);

    // ------------------------------------------------------------
    // Core public functions
    // ------------------------------------------------------------
    function register(
        string memory _name,
        bytes32 _cid,
        bool _isEncrypted,
        int256 _lat,
        int256 _lon,
        uint256 _date
    ) public {
        bytes32 _transformedName = _stringToBytes32(_name);

        // add to incidents store
        incidents.push(
            IncidentReport(
                incidents_size,
                _transformedName,
                _cid,
                _isEncrypted,
                _lat,
                _lon,
                _date,
                msg.sender
            )
        );

        // add victimToIncidentId item
        uint8 currentVictimIncidentCount = victimIncidentCount[msg.sender];
        victimToIncidentId[msg
            .sender][currentVictimIncidentCount] = incidents_size;
        victimIncidentCount[msg.sender] = uint8(
            SafeMath.add(currentVictimIncidentCount, 1)
        );

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
            incidents_size,
            msg.sender,
            _transformedName,
            _cid,
            _isEncrypted,
            _lat,
            _lon,
            _date
        );

        // update counters
        incidents_size++;
    }

    function updateCidOfIncident(uint256 _id, bytes32 _cid) public {
        incidents[_id].cid = _cid;
    }

    // ------------------------------------------------------------
    // View functions
    // ------------------------------------------------------------
    function getAllReportsOfVictim(address _victim)
        public
        view
        returns (
            uint256[] memory ids
        )
    {
        uint8 currentVictimIncidentCount = victimIncidentCount[_victim];

        ids = new uint256[](currentVictimIncidentCount);

        for (uint8 i = 0; i < currentVictimIncidentCount; i++) {
            uint256 currentIncidentId = victimToIncidentId[_victim][i];

            ids[i] = currentIncidentId;
        }
        return (ids);
    }

    function getAllVictimsOnMolester(string memory _name)
        public
        view
        returns (address[] memory victims)
    {
        bytes32 _transformedName = _stringToBytes32(_name);


            uint8 currentMolesterIncidentCount
         = molesterIncidentCount[_transformedName];
        victims = new address[](currentMolesterIncidentCount);

        for (uint8 i = 0; i < currentMolesterIncidentCount; i++) {
            victims[i] = molesterToVictim[_transformedName][i];
        }

        return victims;
    }

    function getAllIncidents()
        public
        view
        returns (
            uint256[] memory ids,
            bytes32[] memory names,
            int256[] memory lats,
            int256[] memory lons,
            bool[] memory isEncrypteds
        )
    {
        ids = new uint256[](incidents_size);
        names = new bytes32[](incidents_size);
        lats = new int256[](incidents_size);
        lons = new int256[](incidents_size);
        isEncrypteds = new bool[](incidents_size);

        for (uint256 i = 0; i < incidents_size; i++) {
            IncidentReport memory incident = incidents[i];
            ids[i] = incident.id;
            names[i] = incident.name;
            lats[i] = incident.lat;
            lons[i] = incident.lon;
            isEncrypteds[i] = incident.isEncrypted;
        }
        return (ids, names, lats, lons, isEncrypteds);
    }

    function getIncident(uint256 id)
        public
        view
        returns (
            bytes32 name,
            int256 lat,
            int256 lon,
            bytes32 cid,
            bool isEncrypted,
            uint256 date,
            address author
        )
    {
        return (
            incidents[id].name,
            incidents[id].lat,
            incidents[id].lon,
            incidents[id].cid,
            incidents[id].isEncrypted,
            incidents[id].date,
            incidents[id].author
        );
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
