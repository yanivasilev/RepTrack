import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../../navigation/AppNavigator";
import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";
import BackButton from "../../../components/BackButton";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { useEffect, useState } from "react";
import { profileDetailsApi } from "../../../services/api/profileDetailsApi";
import { SubmitChangeUsername } from "../../../components/settings/SubmitChangeUsername";

type Props = NativeStackScreenProps<AppStackParamList, "ChangeUsername">;

export default function ChangeUsernameScreen({ navigation }: Props) {
    const [username, setUsername] = useState("");
    const [overlay, setOverlay] = useState<{ text: string; success: boolean; } | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<"username", string>>>({});

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                await fetchUsername();
            } catch (e: any) {
                setOverlay({
                    text: e?.message ?? "Failed to load username.",
                    success: false,
                });
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const fetchUsername = async () => {
        setErrors({});
        const res = await profileDetailsApi();
        setUsername(res.username);
    };

    const handleChangeUsernamePress = async () => {
        setLoading(true);
        setErrors({});

        const res = await SubmitChangeUsername({ data: { username } });

        setLoading(false);

        if (!res.success) {
            if (!res.errors) {
                setOverlay({
                    text: res.message,
                    success: false,
                });
            } else {
                setErrors(res.errors ?? {});
            }
            return;
        }

        setOverlay({
            text: res.message,
            success: true,
        });
        return;
    }

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.root}>
                <BackButton navigation={navigation} />
                <Text style={styles.title}>Change{"\n"}Username</Text>

                <View style={styles.container}>
                    <View>
                        <Input
                            label='Username'
                            placeholder='Enter username'
                            value={username}
                            onChangeText={(v) => setUsername(v)}
                            error={errors.username}
                        />
                        <Text style={{ marginTop: 5, fontSize: 12, color: "gray" }}>You can only change your username once every 30 days.</Text>
                    </View>

                    <Button label="DONE" onPress={handleChangeUsernamePress} />
                </View>
            </View>

            {/* FEEDBACK MESSAGE */}
            {(overlay || loading) && (
                <Modal
                    visible={true}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setOverlay(null)} // ANDROID BACK BUTTON
                >
                    <View style={styles.overlay}>
                        <View style={!loading && styles.box}>
                            {loading ? (
                                <ActivityIndicator size="large" color="#22c55e" />
                            ) : (
                                <Text
                                    style={[
                                        styles.text,
                                        { color: overlay?.success ? "green" : "red" },
                                    ]}
                                >
                                    {overlay?.text}
                                </Text>
                            )}

                            {!loading && (
                                <Pressable onPress={() => setOverlay(null)} style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}>
                                    <Text style={styles.closeText}>CLOSE</Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                </Modal>
            )}
        </SafeAreaView>
    );
}