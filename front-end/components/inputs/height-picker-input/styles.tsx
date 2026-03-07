import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    label: {
        marginBottom: 5,
        color: "green",
        fontWeight: "bold"
    },
    inputWrapper: {
        position: "relative"
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
    },
    unitContainer: {
        position: "absolute",
        right: 8,
        top: "50%",
        flexDirection: "row",
        transform: [{ translateY: -16 }],
    },
    unitButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "green",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 6,
        backgroundColor: "white",
    },
    unitActive: {
        backgroundColor: "green",
    },
    unitText: {
        fontSize: 12,
        fontWeight: "700",
        color: "green",
    },
    unitTextActive: {
        color: "white",
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: 4,
    },
    pickerBox: {
        overflow: "hidden",
    },
    pickerRow: {
        flexDirection: "row",
    },
    picker: {
        flex: 1,
    },
    doneContainer: {
        position: "absolute",
        right: 8,
        top: 6,
        flexDirection: "row",
    },
    doneButton: {
        width: 40,
        height: 32,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "green",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "green",
    },
    doneButtonError: {
        borderColor: "red",
        backgroundColor: "red",
    },
    doneText: {
        fontSize: 12,
        fontWeight: "700",
        color: "white",
    },
    pressed: {
        backgroundColor: "darkgreen",
    },
})