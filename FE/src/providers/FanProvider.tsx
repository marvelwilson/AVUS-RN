import { usePathname } from "expo-router";
import { ReactNode, useEffect } from "react";

import FanChatSheet from "../components/fan/FanChatSheet";
import FanOrb from "../components/fan/FanOrb";

import useFan from "@/src/hooks/useFan";
import WakeWordService from "@/src/sdk/fan/services/wakeword.service";
import TTSService from "@/src/sdk/fan/services/tts.service";
import { useSettingsStore } from "@/src/store/settings";
import { useFanStore } from "@/src/store/fan";
import PolicyManager from "@/src/sdk/fan/policy/manager";

type FanProviderProps = {
    children: ReactNode;
};


export default function FanProvider({
    children,
}: FanProviderProps) {
    const pathname = usePathname();

    const {
        visible,
        expanded,
        muted,
        close,
    } = useFan();
    const fanMuted = useSettingsStore((state) => state.fanMuted);
    const setMuted = useFanStore((state) => state.setMuted);
    const setGasSponsorshipEligible = useSettingsStore((state) => state.setGasSponsorshipEligible);

    useEffect(() => {
        void PolicyManager.load()
            .then(policy => setGasSponsorshipEligible(policy.account?.gasSponsorshipEligible === true))
            .catch(error => {
                console.warn("FAN manifest could not be loaded.", error);
                setGasSponsorshipEligible(false);
            });
    }, [setGasSponsorshipEligible]);

    useEffect(() => {
        setMuted(fanMuted);
    }, [fanMuted, setMuted]);

    const shouldHide =
        pathname === "/" ||
        pathname.startsWith("/settings") ||
        pathname.startsWith("/auth") ||
        pathname.startsWith("/onboarding") ||
        pathname.startsWith("/scan");

    useEffect(() => {
        const voiceEnabled = !shouldHide && !expanded && !muted;
        TTSService.setEnabled(voiceEnabled);

        if (voiceEnabled) {
            WakeWordService.start();
        } else {
            WakeWordService.stop();
        }

        return () => WakeWordService.stop();
    }, [expanded, muted, shouldHide]);

  
    return (
        <>
            {children}

            {!shouldHide && visible && (
                <>
                    <FanOrb />

                    <FanChatSheet
                        visible={expanded}
                        onClose={close}
                    />
                </>
            )}
        </>
    );
}
