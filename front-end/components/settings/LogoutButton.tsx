import { Alert, Pressable, StyleSheet, Text } from "react-native";
import { useAuth } from "../../hooks/authContext";
import { useWorkout } from "../../hooks/WorkoutSessionContext";

export default function LogoutButton() {
    const { signOut } = useAuth();
    const { reset } = useWorkout();

    const onLogout = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Logout",
                style: "destructive",
                onPress: async () => {
                    await reset();
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
            <Text style={styles.logoutText}>LOGOUT</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    logoutButton: {
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
        backgroundColor: "red",
        marginBottom: 10
    },
    logoutPressed: {
        backgroundColor: "darkred"
    },
    logoutText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16
    }
})