import {
    getPin,
    savePin,
} from "./secureStorage";

export async function pinExists() {
  const pin = await getPin();
  return !!pin;
}

export async function createPin(pin: string) {
  if (pin.length !== 4)
    throw new Error("PIN must be 4 digits");

  await savePin(pin);
}

export async function verifyPin(pin: string) {
  const saved = await getPin();

  if (!saved) return false;

  return saved === pin;
}

export async function changePin(
  oldPin: string,
  newPin: string
) {
  const valid = await verifyPin(oldPin);

  if (!valid)
    throw new Error("Current PIN is incorrect.");

  await savePin(newPin);
}