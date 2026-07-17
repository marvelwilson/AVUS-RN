import type { FanTool } from "./tool";

class TransactionTool implements FanTool {

    name = "transaction";

    description = "Prepare Transaction";

    async execute(
        args: Record<string, any> = {},
    ) {

        return {

            recipient:
                args.recipient ?? "",

            amount:
                Number(args.amount ?? 0),

            token:
                args.token ?? null,

            chainId:
                Number(args.chainId ?? 42161),

        };

    }

}

export default new TransactionTool();