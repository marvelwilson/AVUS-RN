import DraftService from "./draft.service";

class SyncService {

    recipient(
        recipient: string,
    ) {

        return DraftService.update({

            recipient,

        });

    }

    amount(
        amount: number,
    ) {

        return DraftService.update({

            amount,

        });

    }

    token(
        token: string,
    ) {

        return DraftService.update({

            token,

        });

    }

    chain(
        chain: string,
    ) {

        return DraftService.update({

            chain,

        });

    }

    fiat(
        fiat: string,
    ) {

        return DraftService.update({

            fiat,

        });

    }

    paymentMethod(
        paymentMethod: string,
    ) {

        return DraftService.update({

            paymentMethod,

        });

    }

    withdrawalMethod(
        withdrawalMethod: string,
    ) {

        return DraftService.update({

            withdrawalMethod,

        });

    }

    fromToken(
        fromToken: string,
    ) {

        return DraftService.update({

            fromToken,

        });

    }

    toToken(
        toToken: string,
    ) {

        return DraftService.update({

            toToken,

        });

    }

}

export default new SyncService();