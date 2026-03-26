import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#fff"
    },
    root: {
        flex: 1,
        backgroundColor: "#fff"
    },
    title: {
        textAlign: "center",
        fontSize: 36,
        color: "green",
        fontWeight: "bold"
    },
    container: {
        paddingHorizontal: 16,
        gap: 10
    },
    bottom: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 16,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#E6E6E6",
        backgroundColor: "white"
    },
    selectExerciseText: {
        color: "gray",
        textAlign: "center",
        marginBottom: 10
    }
});
