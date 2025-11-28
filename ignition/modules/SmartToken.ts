import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("SmartTokenModule", (m) => {
  const initialOwner = m.getParameter("initialOwner");
  const contract = m.contract("SmartToken");

  m.call(contract, "initialize", [initialOwner]);

  return { contract };
});
