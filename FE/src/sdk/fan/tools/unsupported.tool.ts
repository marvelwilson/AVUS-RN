import type { FanTool } from "./tool";

class UnsupportedTool implements FanTool {

    name = "unsupported";

    description = "Unsupported Intent";

    async execute(
        args: Record<string, any> = {},
    ) {

        return {

            success: false,

            message:
                args.message ??
                "I'm not allowed to perform that action at the moment.",

        };

    }

}

export default new UnsupportedTool();