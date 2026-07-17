import axios from "axios";

import { setupInterceptors } from "./api-interceptor";

export const api = axios.create({
    baseURL:process.env.EXPO_PUBLIC_API_URL,

    timeout: 30000,

    headers: {
        "Content-Type": "application/json",
    },
});

setupInterceptors(api);