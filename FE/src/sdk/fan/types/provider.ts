import type { FanIntent } from "./intent";

export interface AIProvider {

    chat(
        message: string,
    ): Promise<FanIntent>;

}