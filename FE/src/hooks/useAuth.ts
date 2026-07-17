import { useAuthStore } from "@/src/store/auth";

import authService from "@/src/services/auth.service";
import { LoginMethod } from "../utils/types";

export const useAuth = () => {
    const {
        user,
        accessToken,
        isAuthenticated,
        setUser,
        clearSession,
    } = useAuthStore();

    return {
        /**
         * State
         */
        user,
        accessToken,
        isAuthenticated,

        /**
         * Actions
         */
        login: (data: { method: LoginMethod; email?: string }) => authService.login(data.method, data.email),

        logout: authService.logout,

        restoreSession: authService.restoreSession,

        /**
         * Store Actions
         */
        setUser,

        clearSession,
    };
};