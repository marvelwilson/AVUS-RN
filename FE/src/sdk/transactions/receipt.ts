import {
  BrowserProvider,
} from "ethers";

export async function getReceipt(
  provider: BrowserProvider,
  hash: string
) {

  return provider.getTransactionReceipt(
    hash
  );
}