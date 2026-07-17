import { create } from "zustand";

export type StatusKind = "info" | "success" | "error";

type StatusPayload = {
  title: string;
  description?: string;
  kind?: StatusKind;
};

type StatusModalState = StatusPayload & {
  visible: boolean;
  show(payload: StatusPayload): void;
  hide(): void;
};

export const useStatusModalStore = create<StatusModalState>((set) => ({
  visible: false,
  title: "",
  description: "",
  kind: "info",
  show: (payload) => set({ visible: true, kind: "info", description: "", ...payload }),
  hide: () => set({ visible: false }),
}));

export const StatusModal = {
  show: (payload: StatusPayload) => useStatusModalStore.getState().show(payload),
  success: (title: string, description = "") => useStatusModalStore.getState().show({ title, description, kind: "success" }),
  error: (title: string, description = "") => useStatusModalStore.getState().show({ title, description, kind: "error" }),
  hide: () => useStatusModalStore.getState().hide(),
};
