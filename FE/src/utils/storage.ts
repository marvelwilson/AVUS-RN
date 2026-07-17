import { storage } from "@/src/store/mmkv";
import * as SecureStore from "expo-secure-store";

/**
 * Secure Keys
 */
export enum SecureStorageKey {
    ACCESS_TOKEN = "accessToken",
    REFRESH_TOKEN = "refreshToken",
}

/**
 * MMKV Keys
 */
export enum AppStorageKey {
    USER = "user",

    SMART_ACCOUNT = "smartAccount",

    SRA = "sra",

    THEME = "theme",

    BIOMETRIC = "biometric",

    HAS_LAUNCHED = "hasLaunched",

    CACHED_BALANCES = "cachedBalances",

    RECENT_CONTACTS = "recentContacts",
}

class Storage {
    /* ----------------------------------------------------------
     * Secure Store
     * ---------------------------------------------------------- */

    async setSecure(
        key: SecureStorageKey,
        value: string
    ) {
        await SecureStore.setItemAsync(key, value);
    }

    async getSecure(
        key: SecureStorageKey
    ) {
        return await SecureStore.getItemAsync(key);
    }

    async removeSecure(
        key: SecureStorageKey
    ) {
        await SecureStore.deleteItemAsync(key);
    }

    /* ----------------------------------------------------------
     * MMKV
     * ---------------------------------------------------------- */

    set<T>(
        key: AppStorageKey,
        value: T
    ) {
        storage.set(
            key,
            JSON.stringify(value)
        );
    }

    get<T>(
        key: AppStorageKey
    ): T | null {
        const value = storage.getString(key);

        if (!value) return null;

        return JSON.parse(value);
    }

    remove(key: AppStorageKey) {
        storage.remove(key);
    }

    /* ----------------------------------------------------------
     * Helpers
     * ---------------------------------------------------------- */

    isFirstLaunch() {
        return (
            storage.getBoolean(
                AppStorageKey.HAS_LAUNCHED
            ) !== true
        );
    }

    setLaunched() {
        storage.set(
            AppStorageKey.HAS_LAUNCHED,
            true
        );
    }

    async clearSession() {
        await Promise.all([
            this.removeSecure(
                SecureStorageKey.ACCESS_TOKEN
            ),

            this.removeSecure(
                SecureStorageKey.REFRESH_TOKEN
            ),
        ]);

        this.remove(AppStorageKey.USER);

        this.remove(AppStorageKey.SMART_ACCOUNT);

        this.remove(AppStorageKey.SRA);

        this.remove(AppStorageKey.CACHED_BALANCES);
    }

    clearApp() {
        storage.clearAll();
    }
}

const storageService = new Storage();

export const isFirstLaunch = () => storageService.isFirstLaunch();
export const setLaunched = () => storageService.setLaunched();

export default storageService;