import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    noExercises: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    noExercisesText: {
        fontSize: 14,
        color: "gray"
    },
    exerciseCard: {
        padding: 14,
        borderRadius: 14,
        backgroundColor: "#F6F6F6",
        gap: 10
    },
    exerciseCardActive: {
        backgroundColor: "#dfdfdf"
    },
    exerciseCardTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 8,
    },
    exerciseNameWrap: {
        flex: 1,
        paddingRight: 6,
    },
    exerciseCardTopButtons: {
        flexDirection: "row",
        gap: 5
    },
    exerciseName: {
        fontWeight: "900",
        textTransform: "uppercase",
        color: "green",
        fontSize: 18,
        flexShrink: 1,
    },
    suggestionContainer: {
        gap: 3,
        marginTop: 5
    },
    suggestionTitle: {
        color: "green",
        fontWeight: "bold"
    },
    suggestionText: {
        color: "gray",
        fontStyle: "italic",
    },
    suggestionValues: {
        color: "green",
        fontWeight: "bold",
        fontStyle: "italic"
    },
    exerciseDelete: {
        backgroundColor: "red",
        padding: 4,
        borderRadius: 8
    },
    exerciseDeletePressed: {
        backgroundColor: "darkred",
        padding: 4,
        borderRadius: 8
    },
    reorderSets: {
        backgroundColor: "green",
        padding: 4,
        borderRadius: 8
    },
    reorderSetsPressed: {
        backgroundColor: "darkgreen",
        padding: 4,
        borderRadius: 8
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
