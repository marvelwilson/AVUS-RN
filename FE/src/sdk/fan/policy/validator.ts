import type {

    FanIntent,

} from "../types/intent";

import PolicyManager from "./manager";

class PolicyValidator {
    validate(
        intent: FanIntent,
    ) {
        let policy: any;


        policy = PolicyManager.get();

        if (!policy) throw new Error("FAN policy is not loaded.");

        const rules = policy.policy;

        if (

            rules.restrictedIntents.includes(

                intent.intent,

            )

        ) {

            throw new Error(

                "Restricted intent.",

            );

        }

        if (

            !rules.allowedIntents.includes(

                intent.intent,

            )

        ) {

            throw new Error(

                "Unsupported intent.",

            );

        }

        if (

            intent.confidence < 0.70

        ) {

            throw new Error(

                "Low confidence.",

            );

        }

        return true;

    }

}

export default new PolicyValidator();
