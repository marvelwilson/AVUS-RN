import type { AxiosInstance } from "axios";

import { useAuthStore } from "@/src/store/auth";

export const setupInterceptors = (
    api: AxiosInstance
) => {
    /**
     * Request Interceptor
     */
    api.interceptors.request.use(
        async (config) => {
            const token =
                useAuthStore
                    .getState()
                    .accessToken;

            if (token) {
                config.headers.Authorization =
                    `Bearer ${token}`;
            }

            return config;
        },
        (error) => Promise.reject(error)
    );

    /**
     * Response Interceptor
     */
    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (
                error.response?.status === 401
            ) {
                /**
                 * Session expired
                 */
                useAuthStore
                    .getState()
                    .logout();
            }

            return Promise.reject(error);
        }
    );
};