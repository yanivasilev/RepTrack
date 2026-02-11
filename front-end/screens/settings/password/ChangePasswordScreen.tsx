import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../../navigation/AppNavigator";
import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";
import BackButton from "../../../components/BackButton";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { useState } from "react";
import { SubmitChangePassword } from "../../../components/settings/SubmitChangePassword";

type Props = NativeStackScreenProps<AppStackParamList, "ChangePassword">;

type ChangePasswordData = {
    currentPassword: string;
    newPassword: string;
    newConfirmPassword: string;
};

const initialChangePasswordData: ChangePasswordData = {
    currentPassword: "",
    newPassword: "",
    newConfirmPassword: "",
};

export default function ChangePasswordScreen({ navigation }: Props) {
    const [data, setData] = useState(initialChangePasswordData);
    const [overlay, setOverlay] = useState<{ text: string; success: boolean; } | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof ChangePasswordData, string>>>({});

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showNewConfirmPassword, setShowNewConfirmPassword] = useState(false);

    const onChange = (key: keyof ChangePasswordData, value: string) => {
        setData((prev) => ({ ...prev, [key]: value }));
    };

    const handleChangePasswordPress = async () => {
        setLoading(true);
        setErrors({});

        const res = await SubmitChangePassword({ data });

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
        setData(initialChangePasswordData);
        return;
    }

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.root}>
                <BackButton navigation={navigation} />
                <Text style={styles.title}>Change{"\n"}Password</Text>

                <View style={styles.container}>
                    <View style={{ gap: 10 }}>
                        <Input
                            label="Current password"
                            value={data.currentPassword}
                            onChangeText={(v) => {
                                onChange("currentPassword", v)
                                setErrors({})
                            }}
                            secureTextEntry={!showCurrentPassword}
                            placeholder="Enter current password"
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="password"
                            autoComplete="password"
                            error={errors.currentPassword}
                            rightIcon={showCurrentPassword ? "eye-off" : "eye"}
                            onRightIconPress={() => setShowCurrentPassword((p) => !p)}
                        />

                        <Input
                            label="New password"
                            value={data.newPassword}
                            onChangeText={(v) => {
                                onChange("newPassword", v)
                                setErrors({})
                            }}
                            secureTextEntry={!showNewPassword}
                            placeholder="Enter new password"
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="newPassword"
                            autoComplete="new-password"
                            error={errors.newPassword}
                            rightIcon={showNewPassword ? "eye-off" : "eye"}
                            onRightIconPress={() => setShowNewPassword((p) => !p)}
                        />

                        <Input
                            label="New confirm password"
                            value={data.newConfirmPassword}
                            onChangeText={(v) => {
                                onChange("newConfirmPassword", v)
                                setErrors({})
                            }}
                            secureTextEntry={!showNewConfirmPassword}
                            placeholder="Enter new confirm password"
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="newPassword"
                            autoComplete="new-password"
                            error={errors.newConfirmPassword}
                            rightIcon={showNewConfirmPassword ? "eye-off" : "eye"}
                            onRightIconPress={() => setShowNewConfirmPassword((p) => !p)}
                        />
                    </View>

                    <Button label="DONE" onPress={handleChangePasswordPress} />
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