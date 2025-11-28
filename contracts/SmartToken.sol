// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {ERC20PermitUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract SmartToken is Initializable, ERC20Upgradeable, ERC20PermitUpgradeable, OwnableUpgradeable, UUPSUpgradeable {
    uint256 public _maxTotalSupply;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    event MaxTotalSupplyUpdated(uint256 oldMaxTotalSupply, uint256 newMaxTotalSupply);

    function initialize(address initialOwner, string calldata _name, string calldata _symbol, uint256 _initMaxTotalSupply) public initializer {
        __ERC20_init(_name, _symbol);
        __ERC20Permit_init(_name);
        __Ownable_init(initialOwner);
        _maxTotalSupply = _initMaxTotalSupply * (10 ** decimals());
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function cap() public view returns (uint256) {
        return _maxTotalSupply;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= _maxTotalSupply, "MaxTotalSupply exceeded");
        _mint(to, amount);
    }

    function setMaxTotalSupply(uint256 newMaxTotalSupply) external onlyOwner {
        require(newMaxTotalSupply >= totalSupply(), "New MaxTotalSupply < totalSupply");
        uint256 oldMaxTotalSupply = _maxTotalSupply;
        _maxTotalSupply = newMaxTotalSupply;
        emit MaxTotalSupplyUpdated(oldMaxTotalSupply, newMaxTotalSupply);
    }

    function version() public pure returns (string memory) {
        return "1.1.0";
    }
}
