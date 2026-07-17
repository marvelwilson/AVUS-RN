import { api } from "@/src/lib/axios";

export interface LoginRequest {
    didToken: string;
    sessionDays: 1 | 3 | 7;
}

class AuthApi {
    /**
     * Login
     */
    login(data: LoginRequest) {
        return api.post("/auth/login", data);
    }

    /**
     * Current User
     */
    me() {
        return api.get("/auth/me");
    }

    /**
     * Logout
     */
    logout() {
        return api.post("/auth/logout");
    }

    updateSessionDuration(days: 1 | 3 | 7) {
        return api.patch("/auth/session-duration", { days });
    }
}

export default new AuthApi();
