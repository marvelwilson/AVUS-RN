import { usePathname } from "expo-router";
import { ReactNode } from "react";

import FanChatSheet from "./FanChatSheet";
import FanOrb from "./FanOrb";

import useFan from "@/src/hooks/useFan";

type Props = {
    children: ReactNode;
};


export default function FanProvider({
    children,
}: Props) {
    const pathname = usePathname();

    const {
        visible,
        expanded,
        close,
    } = useFan();

    const shouldHide =
        pathname === "/" ||
        pathname.startsWith("/settings") ||
        pathname.startsWith("/auth") ||
        pathname.startsWith("/onboarding") ||
        pathname.startsWith("/scan");

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