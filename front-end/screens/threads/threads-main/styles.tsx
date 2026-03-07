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
    container: {
        marginTop: 35,
        gap: 10
    },
    title: {
        textAlign: "center",
        fontSize: 36,
        color: "green",
        fontWeight: "bold",
    },
    quoteContainer: {
        marginTop: 10,
        marginHorizontal: 16,
        padding: 12,
        borderRadius: 14,
        backgroundColor: "#F6F6F6",
        flexDirection: "column",
        gap: 5,
        marginBottom: 10,

        // IOS SHADOW
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 8,

        // ANDROID SHADOW
        elevation: 6,
    },
    quoteTitle: {
        color: "darkgreen",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center"
    },
    quoteText: {
        textAlign: "center",
        color: "green",
        fontStyle: "italic",
        fontSize: 14,
    },
    quoteAuthor: {
        textAlign: "center",
        color: "green",
        fontWeight: "bold",
        fontSize: 12,
    },
    quoteAttribution: {
        marginTop: 6,
        textAlign: "center",
        color: "gray",
        fontSize: 12,
    },
    emptyContainer: {
        paddingHorizontal: 16,
    },
    emptyText: {
        color: "gray",
        textAlign: "center"
    }
});
