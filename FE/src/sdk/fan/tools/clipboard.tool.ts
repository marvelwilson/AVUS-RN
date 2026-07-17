import * as Clipboard from "expo-clipboard";

import type {

    FanTool,

} from "./tool";

class ClipboardTool implements FanTool {

    name = "clipboard";

    description = "Read Clipboard";

    async execute() {

        return {

            recipient: await Clipboard.getStringAsync(),

        };

    }

}

export default new ClipboardTool();