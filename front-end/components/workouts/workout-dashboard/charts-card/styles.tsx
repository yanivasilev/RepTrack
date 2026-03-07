import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    card: {
        padding: 12,
        backgroundColor: "#F6F6F6",
        borderRadius: 14,
        gap: 10
    },
    label: {
        fontWeight: "900",
        color: "green",
        fontSize: 14
    },
    cardLoading: {
        height: 220,
        justifyContent: "center",
        alignItems: "center"
    },
    chartCard: {
        borderRadius: 14,
        overflow: "hidden"
    },
    textNoData: {
        textAlign: "center",
         color: "gray"
    },
    period: {
        flexDirection: "row",
         gap: 8, 
         justifyContent: "center"
    }
})