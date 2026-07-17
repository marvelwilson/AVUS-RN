import { useEffect, useState } from "react";

import { magic } from "@/src/sdk/magic";

export function useMagicProfile() {
  const [profile, setProfile] = useState<{ email?: string; wallet?: string }>({});

  useEffect(() => {
    void magic.user.getInfo().then((info) => {
      setProfile({
        email: info.email ?? undefined,
        wallet: info.wallets?.ethereum?.publicAddress ?? undefined,
      });
    }).catch(console.error);
  }, []);

  return profile;
}
