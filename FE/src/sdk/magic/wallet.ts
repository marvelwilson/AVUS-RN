import { magic } from "./magic";

export async function getWalletAddress() {
    const info = await magic.user.getInfo();

    const address =
        info.wallets?.ethereum?.publicAddress;

    if (!address) {
        throw new Error("Magic wallet not found.");
    }

    return address;
}