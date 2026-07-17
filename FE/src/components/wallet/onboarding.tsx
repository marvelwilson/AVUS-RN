import {
    ArrowDown,
    Check,
    LockKeyhole,
    Mic,
    Network,
    Send,
    ShieldCheck,
    Sparkles,
    WalletCards,
} from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

export type OnboardingIllustration = "routing" | "security" | "fan";

type SlideProps = {
    title: string;
    eyebrow: string;
    description: string;
    illustration: OnboardingIllustration;
    accent: string;
    width: number;
    palette: Palette;
};

type Palette = { background: string; surface: string; text: string; muted: string; border: string; contrast: string };

function RoutingIllustration({ accent, palette }: { accent: string; palette: Palette }) {
    return (
        <View style={styles.artboard}>
            <View style={[styles.orbit, styles.orbitOuter, { borderColor: `${accent}38` }]} />
            <View style={[styles.orbit, styles.orbitInner, { borderColor: `${accent}55` }]} />
            <View style={[styles.networkNode, styles.nodeTop, { backgroundColor: accent }]}><Network size={18} color="#FFFFFF" /></View>
            <View style={[styles.networkNode, styles.nodeLeft, { backgroundColor: palette.surface, borderColor: palette.border }]}><Text style={[styles.nodeText, { color: palette.text }]}>Ξ</Text></View>
            <View style={[styles.networkNode, styles.nodeRight, { backgroundColor: palette.surface, borderColor: palette.border }]}><Text style={[styles.nodeText, { color: palette.text }]}>$</Text></View>
            <View style={styles.routeLine} />
            <View style={[styles.mainCard, { backgroundColor: palette.surface, borderColor: `${accent}66` }]}>
                <View style={[styles.iconTile, { backgroundColor: accent }]}><WalletCards size={28} color={palette.contrast} /></View>
                <View>
                    <Text style={[styles.cardCaption, { color: palette.muted }]}>ONE ADDRESS</Text>
                    <Text style={[styles.cardValue, { color: palette.text }]}>0x7A…F21C</Text>
                </View>
            </View>
            <View style={[styles.actionBadge, { backgroundColor: accent, borderColor: palette.background }]}><ArrowDown size={19} color={palette.contrast} /></View>
        </View>
    );
}

function SecurityIllustration({ accent, palette }: { accent: string; palette: Palette }) {
    return (
        <View style={styles.artboard}>
            <View style={[styles.shieldHalo, { borderColor: `${accent}38` }]} />
            <View style={[styles.shieldHalo, styles.shieldHaloSmall, { borderColor: `${accent}60` }]} />
            <View style={[styles.securityShield, { backgroundColor: accent }]}>
                <ShieldCheck size={58} color={palette.contrast} strokeWidth={1.8} />
            </View>
            <View style={[styles.securityPill, styles.securityPillTop, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                <LockKeyhole size={17} color="#A5B4FC" />
                <Text style={[styles.securityText, { color: palette.text }]}>Self-custody</Text>
                <Check size={15} color="#34D399" />
            </View>
            <View style={[styles.securityPill, styles.securityPillBottom, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                <WalletCards size={17} color="#67E8F9" />
                <Text style={[styles.securityText, { color: palette.text }]}>Always in control</Text>
            </View>
        </View>
    );
}

function FanIllustration({ accent, palette }: { accent: string; palette: Palette }) {
    return (
        <View style={styles.artboard}>
            <View style={[styles.fanGlow, { backgroundColor: `${accent}22` }]} />
            <View style={[styles.chatBubble, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                <View style={styles.chatHeader}>
                    <View style={[styles.fanAvatar, { backgroundColor: accent }]}><Sparkles size={20} color={palette.contrast} /></View>
                    <View>
                        <Text style={[styles.fanName, { color: palette.text }]}>FAN</Text>
                        <Text style={styles.fanStatus}>Ready to help</Text>
                    </View>
                </View>
                <View style={[styles.commandBubble, { backgroundColor: palette.background }]}>
                    <Mic size={16} color="#93C5FD" />
                    <Text style={[styles.commandText, { color: palette.text }]}>“Send $20 safely”</Text>
                </View>
                <View style={styles.confirmRow}>
                    <View style={[styles.confirmIcon, { backgroundColor: accent }]}><Send size={15} color={palette.contrast} /></View>
                    <View style={styles.confirmLines}><View style={styles.confirmLine} /><View style={styles.confirmLineShort} /></View>
                    <Check size={17} color="#34D399" />
                </View>
            </View>
            <View style={[styles.sparkleDot, styles.sparkleOne, { backgroundColor: accent }]} />
            <View style={[styles.sparkleDot, styles.sparkleTwo]} />
        </View>
    );
}

export function Slide({ title, eyebrow, description, illustration, accent, width, palette }: SlideProps) {
    return (
        <View style={[styles.slide, { width }]}>
            {illustration === "routing" ? <RoutingIllustration accent={accent} palette={palette} /> : null}
            {illustration === "security" ? <SecurityIllustration accent={accent} palette={palette} /> : null}
            {illustration === "fan" ? <FanIllustration accent={accent} palette={palette} /> : null}
            <Text style={[styles.eyebrow, { color: accent }]}>{eyebrow}</Text>
            <Text style={[styles.title, { color: palette.text }]}>{title}</Text>
            <Text style={[styles.description, { color: palette.muted }]}>{description}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    slide: { flex: 1, alignItems: "center", paddingHorizontal: 28, paddingTop: 8 },
    artboard: { width: 300, height: 300, justifyContent: "center", alignItems: "center", marginBottom: 24 },
    orbit: { position: "absolute", borderRadius: 999, borderWidth: 1, borderColor: "rgba(96,165,250,0.22)" },
    orbitOuter: { width: 282, height: 282 }, orbitInner: { width: 216, height: 216, borderColor: "rgba(129,140,248,0.25)" },
    networkNode: { position: "absolute", width: 44, height: 44, borderRadius: 15, backgroundColor: "#172554", borderWidth: 1, borderColor: "#334155", justifyContent: "center", alignItems: "center", zIndex: 2 },
    nodeTop: { top: 7 }, nodeLeft: { left: 12, top: 116 }, nodeRight: { right: 12, top: 116 }, nodeText: { color: "#FFFFFF", fontWeight: "900", fontSize: 18 },
    routeLine: { position: "absolute", width: 2, height: 68, top: 51, backgroundColor: "rgba(96,165,250,0.35)" },
    mainCard: { width: 208, height: 116, borderRadius: 26, backgroundColor: "#101A36", borderWidth: 1, padding: 18, flexDirection: "row", alignItems: "center", gap: 14, shadowColor: "#2563EB", shadowOpacity: 0.34, shadowRadius: 25, shadowOffset: { width: 0, height: 14 }, elevation: 12 },
    iconTile: { width: 52, height: 52, borderRadius: 17, alignItems: "center", justifyContent: "center" }, cardCaption: { color: "#64748B", fontSize: 10, fontWeight: "800", letterSpacing: 1.4 }, cardValue: { color: "#F8FAFC", fontSize: 16, fontWeight: "800", marginTop: 5 },
    actionBadge: { position: "absolute", bottom: 37, width: 42, height: 42, borderRadius: 21, borderWidth: 5, borderColor: "#050816", alignItems: "center", justifyContent: "center" },
    shieldHalo: { position: "absolute", width: 260, height: 260, borderRadius: 130, borderWidth: 1 }, shieldHaloSmall: { width: 198, height: 198, borderRadius: 99 },
    securityShield: { width: 116, height: 132, borderTopLeftRadius: 58, borderTopRightRadius: 58, borderBottomLeftRadius: 34, borderBottomRightRadius: 34, alignItems: "center", justifyContent: "center", shadowColor: "#6366F1", shadowOpacity: 0.4, shadowRadius: 24, elevation: 12 },
    securityPill: { position: "absolute", backgroundColor: "#101A36", borderWidth: 1, borderColor: "#263657", borderRadius: 16, height: 48, paddingHorizontal: 14, flexDirection: "row", gap: 8, alignItems: "center" }, securityPillTop: { top: 36, right: 2 }, securityPillBottom: { bottom: 34, left: 0 }, securityText: { color: "#E2E8F0", fontSize: 12, fontWeight: "700" },
    fanGlow: { position: "absolute", width: 264, height: 264, borderRadius: 132 },
    chatBubble: { width: 232, backgroundColor: "#101A36", borderRadius: 28, borderWidth: 1, borderColor: "#263657", padding: 18, shadowColor: "#2563EB", shadowOpacity: 0.32, shadowRadius: 24, elevation: 12 },
    chatHeader: { flexDirection: "row", alignItems: "center", gap: 11 }, fanAvatar: { width: 42, height: 42, borderRadius: 15, alignItems: "center", justifyContent: "center" }, fanName: { color: "#FFFFFF", fontWeight: "900", fontSize: 15 }, fanStatus: { color: "#34D399", fontSize: 11, fontWeight: "600", marginTop: 2 },
    commandBubble: { backgroundColor: "#172554", borderRadius: 16, marginTop: 18, padding: 13, flexDirection: "row", gap: 8, alignItems: "center" }, commandText: { color: "#E2E8F0", fontSize: 13, fontWeight: "700" },
    confirmRow: { marginTop: 14, flexDirection: "row", alignItems: "center", gap: 10 }, confirmIcon: { width: 30, height: 30, borderRadius: 10, backgroundColor: "#67E8F9", alignItems: "center", justifyContent: "center" }, confirmLines: { flex: 1, gap: 5 }, confirmLine: { height: 6, width: 82, borderRadius: 3, backgroundColor: "#475569" }, confirmLineShort: { height: 5, width: 52, borderRadius: 3, backgroundColor: "#334155" },
    sparkleDot: { position: "absolute", width: 12, height: 12, borderRadius: 6 }, sparkleOne: { top: 32, right: 28 }, sparkleTwo: { bottom: 38, left: 24, backgroundColor: "#67E8F9", width: 8, height: 8 },
    eyebrow: { fontSize: 12, fontWeight: "900", letterSpacing: 2.2, textTransform: "uppercase", marginBottom: 12 },
    title: { color: "#F8FAFC", fontSize: 30, lineHeight: 37, fontWeight: "900", textAlign: "center", letterSpacing: -0.7 },
    description: { color: "#94A3B8", fontSize: 15, lineHeight: 23, textAlign: "center", marginTop: 14, maxWidth: 340 },
});
