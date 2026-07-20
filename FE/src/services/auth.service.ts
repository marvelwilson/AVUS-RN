import authApi from "@/src/api/auth.api";
import { magic } from "@/src/sdk/magic/magic";
import Storage, {
    AppStorageKey,
    SecureStorageKey,
} from "@/src/utils/storage";

import { useAuthStore, type IUser } from "@/src/store/auth";
import { useSettingsStore } from "@/src/store/settings";

import { useWalletStore } from "@/src/store/wallet";
import { loginWithEmail, loginWithOAuth } from "../sdk/magic";
import { LoginMethod } from "../utils/types";
import WalletService from "./wallet.service";
import WebsocketService from "./websocket.service";
import NotificationService from "./notification.service";
import { resetIntentClient } from "@/src/sdk/intent/client";

class AuthService {
    /**
     * Login
     */
    async login(method: LoginMethod, email?: string) {
        const authStore = useAuthStore.getState();
        const settingsStore = useSettingsStore.getState();

        try {
            if (method === "email" && !email) {
                throw new Error("Email is required.");
            }
            let didToken;
            switch (method) {
                case "google":
                    didToken = await loginWithOAuth(method)
                    break;

                case "email":
                    didToken = await loginWithEmail(email!)
                    break;

                default:
                    throw new Error("Unsupported login method.");
            }


            /**
             * Backend Authentication
             */
            const { data } = await authApi.login({
                didToken,
                sessionDays: settingsStore.sessionDuration,
            });

            const { accessToken, user } = data.data;

            /**
             * Persist Session
             */
            await Storage.setSecure(
                SecureStorageKey.ACCESS_TOKEN,
                accessToken
            );

            Storage.set(
                AppStorageKey.USER,
                user
            );

            /**
             * Update Store
             */
            authStore.setSession({
                accessToken,
                user,
            });

            await settingsStore.setSessionDuration(settingsStore.sessionDuration);

            const wallet = await WalletService.initialize();

            await NotificationService.initialize();

            WebsocketService.connect();

            return data.data;
        } catch (error) {
            throw error;
        }
    }

    async updateSessionDuration(days: 1 | 3 | 7) {
        const { data } = await authApi.updateSessionDuration(days);
        const accessToken = data.data.accessToken as string;
        await Storage.setSecure(SecureStorageKey.ACCESS_TOKEN, accessToken);
        useAuthStore.setState({ accessToken });
        await useSettingsStore.getState().setSessionDuration(days);
    }

    async restoreSession() {
        const authStore = useAuthStore.getState();

        try {

            const accessToken =
                await Storage.getSecure(
                    SecureStorageKey.ACCESS_TOKEN
                );

            const user = Storage.get<IUser>(
                AppStorageKey.USER
            );

            if (!accessToken || !user) {
                return null;
            }

            const magicLoggedIn = await magic.user.isLoggedIn();
            if (!magicLoggedIn) {
                throw new Error("Magic session expired.");
            }

            authStore.setSession({
                accessToken,
                user,
            });

            const { data } = await authApi.me();

            authStore.setUser(data.data);

            void NotificationService.initialize();

            WebsocketService.connect();

            void WalletService.initialize().catch((error) => {
                console.warn("Wallet initialization failed during session restore.", error);
            });
            Storage.set(
                AppStorageKey.USER,
                data.data
            );

            return data.data;
        } catch (error) {
            void this.logout().catch((logoutError) => {
                console.warn("Session cleanup failed during restore.", logoutError);
            });

            return null;
        }
    }


    async logout() {
        const authStore = useAuthStore.getState();

        try {
            await authApi.logout();
        } catch {
            // Ignore backend logout failures
        }

        try {
            await magic.user.logout();
        } catch {
            // Ignore Magic logout failures
        }

        resetIntentClient();
        
        await Storage.clearSession();

        NotificationService.destroy();

        WalletService.logout();

        WebsocketService.disconnect();

        useWalletStore
            .getState()
            .clearWallet();

        authStore.clearSession();
    }
}

export default new AuthService();
