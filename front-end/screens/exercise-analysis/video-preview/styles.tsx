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
    overlayLayer: {
        ...StyleSheet.absoluteFillObject,
    },
    jointDot: {
        position: "absolute",
        width: 8,
        height: 8,
        borderRadius: 999,
        backgroundColor: "#00E5FF",
        borderWidth: 1,
        borderColor: "#003844",
    },
    boneLine: {
        position: "absolute",
        height: 2,
        backgroundColor: "#00E5FF",
        opacity: 0.9,
    },
    container: {
        padding: 16,
        gap: 10,
        paddingBottom: 24
    },
    videoContainer: {
        height: 240,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: "#000",
    },
    videoSize: {
        width: "100%",
        height: "100%"
    },
    text: {
        color: "gray"
    },
    value: {
        fontWeight: "900",
        color: "green"
    }
});
