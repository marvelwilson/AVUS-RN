import { WalletSigner } from "../signer";

import {
  ChainConfig,
} from "../chains";

import {
  SendTransactionInput,
  TransactionResult,
} from "./types";

export async function sendTransaction(
  signer: WalletSigner,
  chain: ChainConfig,
  tx: SendTransactionInput
): Promise<TransactionResult> {

  const hash =
    await signer.sendTransaction(tx);

  return {
    hash,

    success: true,

    explorerUrl:
      `${chain.blockExplorer}/tx/${hash}`,
  };
}