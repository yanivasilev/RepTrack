import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#fff",
    },
    root: {
        flex: 1,
        backgroundColor: "#fff",
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: "center"
    },
    heading: {
        fontSize: 32,
        fontWeight: "bold",
        color: "green",
        textAlign: "center",
        marginBottom: 24
    },
    helperText: {
        textAlign: "center",
        color: "gray",
    },
    buttonGroup: {
        rowGap: 15,
    },
});
