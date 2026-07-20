import { type PropsWithChildren, useEffect } from "react";

import NotificationService from "@/src/services/notification.service";
import { useAuthStore } from "@/src/store/auth";

export default function NotificationProvider({ children }: PropsWithChildren) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      NotificationService.destroy();
      return;
    }

    void NotificationService.initialize();
    return () => NotificationService.destroy();
  }, [isAuthenticated]);

  return children;
}
