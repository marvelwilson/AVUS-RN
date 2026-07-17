import {
  BrowserProvider,
} from "ethers";

import {
  GasEstimate,
} from "./types";

export async function estimateGas(
  provider: BrowserProvider,
  tx: any
): Promise<GasEstimate> {

  const fee =
    await provider.getFeeData();

  const gasLimit =
    await provider.estimateGas(tx);

  return {

    gasLimit,

    gasPrice:
      fee.gasPrice ?? 0n,

    maxFeePerGas:
      fee.maxFeePerGas ?? undefined,

    maxPriorityFeePerGas:
      fee.maxPriorityFeePerGas ?? undefined,
  };
}