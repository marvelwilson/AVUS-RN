import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function BalanceCard() {

    const [hidden, setHidden] = useState(false);

    return (

        <View style={styles.card}>

            <Text style={styles.label}>

                Total Balance

            </Text>

            <View style={styles.row}>

                <Text style={styles.balance}>

                    {hidden ? "••••••" : "$14,562.43"}

                </Text>

                <Pressable
                    onPress={() => setHidden(!hidden)}
                >

                    {hidden ? <EyeOff color="white" /> : <Eye color="white" />}

                </Pressable>

            </View>

        </View>

    );

}

const styles = StyleSheet.create({

    card: {
        backgroundColor: "#5B5FEF",
        borderRadius: 28,
        padding: 26,
    },

    label: {
        color: "#ddd",
    },

    row: {
        marginTop: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    balance: {
        fontSize: 36,
        fontWeight: "700",
        color: "white",
    }

});