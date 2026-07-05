import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
const illustration = {
    link:
        require("@/assets/images/undraw_wallet_diag.png"),
    globe:
        require("@/assets/images/undraw_around-the-world_1p8h.png"),
    sparkles:
        require("@/assets/images/undraw_artificial-intelligence_43qa.png"),
};
const { width, height } = Dimensions.get("window");
export function Slide({ title, desc, icon, color }: any) {
    const svgSource = illustration[icon];

    return (
        <View style={styles.slide}>
            <Image
                source={svgSource}
                style={styles.image}
                resizeMode="contain"
            />

            <Text style={[styles.title, { color: color }]}>{title}</Text>
            <Text style={[styles.desc, { color: color }]}>{desc}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        width,
        height: height - 500,
        borderRadius: 16,
        marginBottom: 12,
    },
    slide: {
        width,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 10,
    },

    desc: {
        fontSize: 16,
        textAlign: "center",
    },

})