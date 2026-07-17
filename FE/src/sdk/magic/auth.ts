import { magic } from "./magic";


/**
 * Login with Email OTP
 */
export async function loginWithEmail(
    email: string
) {

    if (!email) {
        throw new Error(
            "Email is required"
        );
    }


    await magic.auth.loginWithEmailOTP({
        email,
    });


    return getDIDToken();
}



/**
 * Login with OAuth
 */
export async function loginWithOAuth(
    provider: "google"
) {

    await magic.oauth.loginWithPopup({
        provider,
        redirectURI:"avuswalletfe://auth/signin",
    });


    return getDIDToken();
}



/**
 * Get Magic DID Token
 */
export async function getDIDToken() {

    return await magic.user.getIdToken();

}



/**
 * Check Magic Authentication
 */
export async function isMagicLoggedIn() {

    return await magic.user.isLoggedIn();

}



/**
 * Logout Magic Session
 */
export async function logoutMagic() {

    await magic.user.logout();

}