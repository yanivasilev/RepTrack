import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    label: {
        marginBottom: 5,
        color: "green",
        fontWeight: "bold",
    },
    inputWrapper: {
        position: "relative",
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: "green"
    },
    inputText: {
        color: "gray",
    },
    clearButton: {
        alignSelf: "flex-start",
        marginTop: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: "#E6E6E6",
    },
    clearButtonPressed: {
        opacity: 0.7,
    },
    clearText: {
        color: "green",
        fontSize: 11,
        fontWeight: "700",
    },
    doneContainer: {
        position: "absolute",
        right: 8,
        top: 5,
        flexDirection: "row"
    },
    doneButton: {
        width: 40,
        height: 32,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "green",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "green"
    },
    doneButtonError: {
        borderColor: "red",
        backgroundColor: "red"
    },
    doneText: {
        fontSize: 12,
        fontWeight: "700",
        color: "white"
    },
    pressed: {
        backgroundColor: "darkgreen"
    },
});
