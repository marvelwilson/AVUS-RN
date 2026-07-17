import Router from "../core/router";

import type {

    FanTool,

} from "./tool";

class ScanTool implements FanTool {

    name = "scan";

    description = "Open QR Scanner";

    async execute() {

        Router.scan();

    }

}

export default new ScanTool();