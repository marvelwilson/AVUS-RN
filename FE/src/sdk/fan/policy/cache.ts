import type { FanPolicy } from "../types/policy";

class PolicyCache {

    private policy?: FanPolicy;

    set(
        policy: FanPolicy,
    ) {

        this.policy = policy;

    }

    get() {

        return this.policy;

    }

    clear() {

        this.policy = undefined;

    }

}

export default new PolicyCache();