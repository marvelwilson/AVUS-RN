import { createPublicClient, http } from "viem";
import { arbitrum } from "viem/chains";

import {
  createKernelAccount,
} from "@zerodev/sdk";

import {
  getEntryPoint,
  KERNEL_V3_2,
} from "@zerodev/sdk/constants";

import {
  signerToEcdsaValidator,
} from "@zerodev/ecdsa-validator";

import {
  createIntentClient,
  installIntentExecutor,
  INTENT_V0_4,
  IntentClient,
} from "@zerodev/intent";

import { magic } from "@/src/sdk/magic";

const publicClient = createPublicClient({
  chain: arbitrum,
  transport: http(process.env.EXPO_PUBLIC_ARBITRUM_RPC),
});

let cachedClient: IntentClient | undefined;

export async function getIntentClient() {

  if (cachedClient) {
    return cachedClient;
  }

  const bundlerRpc = process.env.EXPO_PUBLIC_ZERODEV_RPC;
  if (!bundlerRpc) {
    throw new Error("Missing EXPO_PUBLIC_ZERODEV_RPC. Add an Arbitrum mainnet ZeroDev project RPC.");
  }

  const [rpcChainId, bundlerChainId] = await Promise.all([
    publicClient.getChainId(),
    createPublicClient({ chain: arbitrum, transport: http(bundlerRpc) }).getChainId(),
  ]);
  if (rpcChainId !== arbitrum.id || bundlerChainId !== arbitrum.id) {
    throw new Error(
      `RPC network mismatch (public ${rpcChainId}, ZeroDev ${bundlerChainId}); Arbitrum mainnet (${arbitrum.id}) is required.`,
    );
  }


  const validator =
    await signerToEcdsaValidator(
      publicClient,
      {
        signer: magic.rpcProvider,
        entryPoint: getEntryPoint("0.7"),
        kernelVersion: KERNEL_V3_2,
      },
    );

  const kernel =
    await createKernelAccount(
      publicClient,
      {
        plugins: {
          sudo: validator,
        },
        entryPoint: getEntryPoint("0.7"),
        kernelVersion: KERNEL_V3_2,
        initConfig: [
          installIntentExecutor(
            INTENT_V0_4,
          ),
        ],
      },
    );

  cachedClient =
    createIntentClient({

      account: kernel,

      chain: arbitrum,

      bundlerTransport: http(
        bundlerRpc,
      ),

      version: INTENT_V0_4,

    });

  return cachedClient;
}

export async function getIntentAccountAddress() {
  const client = await getIntentClient();
  const address = client.account?.address;
  if (!address) throw new Error("ZeroDev intent account address is unavailable.");
  return address;
}

export function resetIntentClient() {
  cachedClient = undefined;
}
