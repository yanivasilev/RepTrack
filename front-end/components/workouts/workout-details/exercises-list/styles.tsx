import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    exerciseCard: {
        padding: 14,
        borderRadius: 14,
        backgroundColor: "#F6F6F6",
        gap: 10
    },
    exerciseCardTop: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    exerciseCardTopButtons: {
        flexDirection: "row",
        gap: 5
    },
    exerciseName: {
        fontWeight: "900",
        textTransform: "uppercase",
        color: "green",
        fontSize: 18
    },
    notesButton: {
        backgroundColor: "blue",
        padding: 4,
        borderRadius: 8
    },
    notesButtonPressed: {
        backgroundColor: "darkblue",
        padding: 4,
        borderRadius: 8
    }
});
