import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes";
import walletRoutes from "../modules/wallet/wallet.routes";
import transactionRoutes from "../modules/transactions/transaction.routes";
import webhookRoutes from "../modules/webhooks/webhook.routes";
import { notificationRoutes } from "../modules/notifications";
import fanRoutes from "../modules/fan/fan.routes";
import commerceRoutes from "../modules/commerce/commerce.routes";
import marketRoutes from "../modules/market/market.routes";

const router = Router();

router.use(
    "/auth",
    authRoutes,
);

router.use(
    "/wallet",
    walletRoutes,
);

router.use(
    "/transactions",
    transactionRoutes,
);

router.use(
    "/webhooks",
    webhookRoutes,
);

router.use(
    "/notifications",
    notificationRoutes,
);


router.use(
    "/fan",
    fanRoutes,
);

router.use(
    "/commerce",
    commerceRoutes,
);

router.use("/market", marketRoutes);

export default router;
