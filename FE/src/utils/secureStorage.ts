import * as SecureStore from "expo-secure-store";

const KEYS = {
  PIN: "avus_pin",
  SESSION_EXPIRES: "avus_session_expires",
};

export async function savePin(pin: string) {
  await SecureStore.setItemAsync(KEYS.PIN, pin, {
    keychainAccessible:
      SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

export async function getPin() {
  return await SecureStore.getItemAsync(KEYS.PIN);
}

export async function deletePin() {
  await SecureStore.deleteItemAsync(KEYS.PIN);
}

export async function saveSessionExpiry(expiry: number) {
  await SecureStore.setItemAsync(
    KEYS.SESSION_EXPIRES,
    expiry.toString()
  );
}

export async function getSessionExpiry() {
  const value = await SecureStore.getItemAsync(
    KEYS.SESSION_EXPIRES
  );

  return value ? Number(value) : null;
}

export async function clearSessionExpiry() {
  await SecureStore.deleteItemAsync(KEYS.SESSION_EXPIRES);
}