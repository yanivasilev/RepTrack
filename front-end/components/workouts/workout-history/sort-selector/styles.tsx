import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    label: {
        marginBottom: 5,
        color: "green",
        fontWeight: "bold",
    },
    container: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        gap: 10
    },
    button: {
        padding: 12,
        borderWidth: 1,
        borderColor: "green",
        borderRadius: 8,
        backgroundColor: "white",
        flex: 1
    },
    buttonActive: {
        backgroundColor: "green"
    },
    buttonText: {
        color: "green",
        fontWeight: "bold",
        textAlign: "center"
    },
    buttonTextActive: {
        color: "white"
    }
});