import { formatUnits } from "ethers";

export function formatGasPrice(
  gas: bigint
) {

  return formatUnits(
    gas,
    "gwei"
  );
}