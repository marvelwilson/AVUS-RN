import { create } from "zustand";

export interface IUser {
    _id: string;
    email: string;
    issuer: string;
    displayName?: string;
    avatar?: string;
    wallet?: string;
}



interface AuthState {
    /**
     * State
     */
    user: IUser | null;

    accessToken: string | null;

    isAuthenticated: boolean;

    /**
     * Actions
     */
    login: (user: IUser) => void;

    logout: () => void;

    setSession: (payload: {
        user: IUser;
        accessToken: string;
    }) => void;

    setUser: (user: IUser) => void;

    clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    /**
     * Initial State
     */
    user: null,

    accessToken: null,

    isAuthenticated: false,

    /**
     * Set Session
     */
    login: (user) =>
        set({
            user,
            isAuthenticated: true,
        }),

    logout: () =>
        set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
        }),

    setSession: ({ user, accessToken }) =>
        set({
            user,
            accessToken,
            isAuthenticated: true,
        }),

    /**
     * Update User
     */
    setUser: (user) =>
        set({
            user,
        }),



    /**
     * Logout
     */
    clearSession: () =>
        set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
        }),
}));