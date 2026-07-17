import type { FanIntent } from "./intent";

export interface FanAction {

    id: string;

    description: string;

    execute(
        intent: FanIntent,
    ): Promise<void>;

}