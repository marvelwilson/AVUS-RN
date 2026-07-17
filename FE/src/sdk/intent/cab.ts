import { arbitrum, base, optimism } from "viem/chains";

import { getIntentClient } from "./client";

export async function getCAB(
    tokenTickers?: string[],
) {

    const client =
        await getIntentClient();

    return client.getCAB({

        networks: [

            arbitrum.id,

            base.id,

            optimism.id,

        ],

        tokenTickers,

    });

}

export async function getPortfolio() {

    const cab =
        await getCAB();

    const assets =
        cab.tokens.map((token: any) => ({

            ticker: token.ticker,

            amount: BigInt(token.amount),

            decimals: token.decimal,

            breakdown:

                token.breakdown.map(

                    (item: any) => ({

                        chainId: item.chainId,

                        address: item.address,

                        amount: BigInt(item.amount),

                    }),

                ),

        }));

    return {

        assets,

        tokenCount: assets.length,

    };

}

export async function getBalance(
    ticker: string,
) {

    const cab =
        await getCAB([ticker]);

    return cab.tokens[0];

}