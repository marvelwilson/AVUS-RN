import Router from "../core/router";
import type { FanTool } from "./tool";

class GameFiTool implements FanTool {
    name = "gamefi";
    description = "Open GameFi";
    async execute() {
        Router.gamefi();
        return true;
    }
}

export default new GameFiTool();
