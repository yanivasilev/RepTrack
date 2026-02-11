import { Alert, Pressable, StyleSheet, Text } from "react-native";
import { useAuth } from "../../hooks/authContext";

export default function LogoutButton() {
    const { signOut } = useAuth();

    const onLogout = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Logout",
                style: "destructive",
                onPress: async () => {
                    await signOut();
                },
            },
        ]);
    };

    return (
        <Pressable
            onPress={onLogout}
            style={({ pressed }) => [
                styles.logoutButton,
                pressed && styles.logoutPressed,
            ]}
        >
            <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    logoutButton: {
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
        backgroundColor: "red"
    },
    logoutPressed: {
        opacity: 0.85
    },
    logoutText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16
    }
})