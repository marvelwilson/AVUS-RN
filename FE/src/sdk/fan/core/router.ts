import {

    router,

} from "expo-router";

class FanRouter {

    send(
        params?: Record<string, any>,
    ) {
      console.log(params)
        router.push({

            pathname:

                "/send/confirm",

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

            "/(tabs)/home",

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
