import { Magic } from "@magic-sdk/admin";
import { env } from "../config/env";

class MagicService {
    private magic: Magic;

    constructor() {
        this.magic = new Magic(env.MAGIC_SECRET_KEY);
    }

    async verifyDidToken(didToken: string) {
        try {
            this.magic.token.validate(didToken);

            const metadata =
                await this.magic.users.getMetadataByToken(didToken);

            return metadata;

        } catch (error) {
            console.error("Magic verification failed", error);
            throw error;
        }
    }
}

export default new MagicService();