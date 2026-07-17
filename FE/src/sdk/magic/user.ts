import { magic } from "./magic";

export async function getMagicSigner() {
    const info = await magic.user.getInfo();

    const address = info.wallets?.ethereum?.publicAddress;

    if (!address) {
        throw new Error("Magic wallet address not found.");
    }

    return {
        address,
        signer: magic.rpcProvider as any,
    };
}