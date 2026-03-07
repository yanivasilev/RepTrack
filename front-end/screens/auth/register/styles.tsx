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
    backButton: {
        position: "absolute",
        top: 16,
        left: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "green",
        backgroundColor: "green",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
    },
    contentArea: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
    },
    heading: {
        fontSize: 32,
        fontWeight: "bold",
        color: "green",
        textAlign: "center",
        marginBottom: 24,
    },
    login: {
        color: "green",
        textDecorationLine: "underline",
        textAlign: "center",
    },
    progressPosition: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
    },
    progress: {
        height: 10,
        backgroundColor: "#e0e0e0",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "green",
    },
    pressed: {
        backgroundColor: "darkgreen"
    },
    overlay: {
        position: "absolute" as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100
    },
    box: {
        backgroundColor: "white",
        paddingVertical: 20,
        paddingHorizontal: 24,
        borderRadius: 16,
        maxWidth: "80%",
        alignItems: "center"
    },
    text: {
        color: "white",
        fontSize: 16,
        textAlign: "center"
    },
    closeButton: {
        marginTop: 16,
        paddingVertical: 10,
        paddingHorizontal: 24,
        backgroundColor: "gray",
        borderRadius: 12
    },
    closeButtonPressed: {
        backgroundColor: "darkgray",
    },
    closeText: {
        color: "white",
        fontWeight: "bold"
    },
});
