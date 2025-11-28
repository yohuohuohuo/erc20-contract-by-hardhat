// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {SmartToken} from "./SmartToken.sol";

contract SmartTokenFactory is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    address public implementationAddress;

    event TokenCreated(address indexed owner, address indexed tokenAddress, bytes32 projectId, string name, string symbol);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _initialImplementationAddress) public initializer {
        __Ownable_init(msg.sender);
        implementationAddress = _initialImplementationAddress;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function createToken(bytes32 _projectId, string calldata _name, string calldata _symbol, uint256 _initMaxTotalSupply) external {
        require(implementationAddress != address(0), "implementationAddress can't be zero address");

        bytes32 salt = keccak256(abi.encode(_projectId, _name, _symbol, _initMaxTotalSupply));
        address tokenAddress = Clones.cloneDeterministic(implementationAddress, salt);

        (bool success, bytes memory returnData) = tokenAddress.call(abi.encodeCall(SmartToken.initialize, (msg.sender, _name, _symbol, _initMaxTotalSupply)));
        if (!success) {
            assembly {
                revert(add(returnData, 32), mload(returnData))
            }
        }

        emit TokenCreated(msg.sender, tokenAddress, _projectId, _name, _symbol);
    }

    function setImplementationAddress(address _implementationAddress) external onlyOwner {
        require(_implementationAddress != address(0), "_implementationAddress can't be zero address");
        implementationAddress = _implementationAddress;
    }

    function version() public pure returns (string memory) {
        return "1.0.0";
    }
}
