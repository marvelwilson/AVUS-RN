import { storage } from "../store/mmkv";

export function isFirstLaunch() {
  return !storage.getBoolean("hasLaunched");
}

export function setLaunched() {
  storage.set("hasLaunched", true);
}