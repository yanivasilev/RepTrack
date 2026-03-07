import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfilesParamList } from "../../../navigation/ProfilesNavigator";
import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { Keyboard, KeyboardAvoidingView, Platform, Text, TouchableWithoutFeedback, View } from "react-native";
import BackButton from "../../../components/buttons/BackButton";
import Input from "../../../components/inputs/Input";
import Button from "../../../components/buttons/Button";
import { useEffect, useState } from "react";
import { SubmitChangePassword } from "../../../components/settings/SubmitChangePassword";
import FeedbackModal from "../../../components/FeedbackModal";
import { ChangePasswordType } from "../../../libs/types/settings/ChangePasswordType";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import { getProfileApi } from "../../../services/api/profiles/getProfileApi";

type Props = NativeStackScreenProps<ProfilesParamList, "ChangePassword">;

const initialChangePassword: ChangePasswordType = {
    currentPassword: "",
    newPassword: "",
    newConfirmPassword: "",
};

export default function ChangePasswordScreen({ navigation }: Props) {
    const [data, setData] = useState<ChangePasswordType>(initialChangePassword);
    const [overlay, setOverlay] = useState<{ text: string; success: boolean } | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [errors, setErrors] = useState<Partial<Record<keyof ChangePasswordType, string>>>({});

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showNewConfirmPassword, setShowNewConfirmPassword] = useState(false);

    const onChange = (key: keyof ChangePasswordType, value: string) => {
        setData((prev) => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setFetchError(null);
                await getProfileApi();
            } catch (e: any) {
                setFetchError(e?.message ?? "Failed to load password settings.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleChangePasswordPress = async () => {
        setSubmitting(true);
        setErrors({});

        const res = await SubmitChangePassword({ data });

        setSubmitting(false);

        if (!res.success) {
            if (!res.errors) {
                setOverlay({ text: res.message, success: false });
            } else {
                setErrors(res.errors ?? {});
            }
            return;
        }

        setOverlay({ text: res.message, success: true });
        setData(initialChangePassword);
    };

    if (loading) return <Loading message="Loading password settings..." />;

    if (fetchError) return <Error navigation={navigation} error={fetchError ?? "Something went wrong."} />;

    return (
        <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <KeyboardAvoidingView
                    style={styles.root}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
                >
                    <BackButton navigation={navigation} />
                    <Text style={styles.title}>Change{"\n"}Password</Text>

                    <View style={styles.container}>
                        <View style={{ gap: 10 }}>
                            <Input
                                label="Current password"
                                value={data.currentPassword}
                                onChangeText={(v) => {
                                    onChange("currentPassword", v);
                                    setErrors({});
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
                                    onChange("newPassword", v);
                                    setErrors({});
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
                                    onChange("newConfirmPassword", v);
                                    setErrors({});
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

                    <FeedbackModal
                        visible={Boolean(overlay) || submitting}
                        loading={submitting}
                        message={overlay?.text}
                        success={overlay?.success}
                        onClose={() => setOverlay(null)}
                    />
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}
