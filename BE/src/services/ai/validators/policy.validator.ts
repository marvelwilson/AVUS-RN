import manifest from "../../../modules/fan/fan.manifest";

class PolicyValidator {

    validate(

        intent: string,

    ) {

        if (intent === "collect_information") {
            return true;
        }

        if (

            manifest.policy

                .restrictedIntents

                .includes(

                    intent,

                )

        ) {

            return false;

        }

        if (

            !manifest.policy

                .allowedIntents

                .includes(

                    intent,

                )

        ) {

            return false;

        }

        return true;

    }

}

export default new PolicyValidator();
