import { z } from "zod";

export const registerDeviceSchema =
    z.object({

        body: z.object({

            expoPushToken:

                z.string(),

            deviceId:

                z.string().uuid(),

        }),

    });
