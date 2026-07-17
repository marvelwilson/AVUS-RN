import fanApi from "@/src/api/fan.api";

import Cache from "./cache";

class PolicyManager {

    async load() {

        const {

            data,

        } =
            await fanApi.manifest();
         
        Cache.set(
            data.data,
        );

        return data.data;

    }

    get() {

        return Cache.get();

    }

}

export default new PolicyManager();