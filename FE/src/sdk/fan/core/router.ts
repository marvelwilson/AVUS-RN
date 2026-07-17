import {

    router,

} from "expo-router";

class FanRouter {

    send(
        params?: Record<string, any>,
    ) {

        router.push({

            pathname:

                "/send/enterAddress",

            params,

        });

    }

    receive() {

        router.push(

            "/receive",

        );

    }

    scan() {

        router.push(

            "/scan",

        );

    }

    history() {

        router.push(

            "/activity",

        );

    }

    portfolio() {

        router.push(

            "/(tabs)",

        );

    }

    buy(params?: Record<string, any>) {

        router.push({ pathname: "/buy", params });

    }

    sell(params?: Record<string, any>) {

        router.push({ pathname: "/sell", params });

    }

    gamefi() {
        router.push("/gamefi");
    }

}

export default new FanRouter();
