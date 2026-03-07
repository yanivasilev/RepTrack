import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { Keyboard, KeyboardAvoidingView, Platform, Text, TouchableWithoutFeedback, View } from "react-native";
import BackButton from "../../../components/buttons/BackButton";
import Input from "../../../components/inputs/Input";
import Button from "../../../components/buttons/Button";
import { useEffect, useState } from "react";
import { SubmitChangeUsername } from "../../../components/settings/SubmitChangeUsername";
import { ProfilesParamList } from "../../../navigation/ProfilesNavigator";
import { getProfileApi } from "../../../services/api/profiles/getProfileApi";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import FeedbackModal from "../../../components/FeedbackModal";

type Props = NativeStackScreenProps<ProfilesParamList, "ChangeUsername">;

export default function ChangeUsernameScreen({ navigation }: Props) {
    const [username, setUsername] = useState("");
    const [overlay, setOverlay] = useState<{ text: string; success: boolean; } | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [errors, setErrors] = useState<Partial<Record<"username", string>>>({});

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setFetchError(null);
                await fetchUsername();
            } catch (e: any) {
                setFetchError(e?.message ?? "Failed to load username.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const fetchUsername = async () => {
        setErrors({});
        const res = await getProfileApi();
        setUsername(res.username);
    };

    const handleChangeUsernamePress = async () => {
        setSubmitting(true);
        setErrors({});

        const res = await SubmitChangeUsername({ data: { username } });

        setSubmitting(false);

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
    };

    if (loading) return <Loading />;

    if (fetchError) return <Error navigation={navigation} error={fetchError ?? "Something went wrong."} />;

    return (
        <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}>
                    <BackButton navigation={navigation} />
                    <Text style={styles.title}>Change{"\n"}Username</Text>

                    <View style={styles.container}>
                        <View>
                            <Input
                                label="Username"
                                placeholder="Enter username"
                                value={username}
                                onChangeText={(v) => setUsername(v)}
                                error={errors.username}
                            />
                            <Text style={styles.tip}>
                                You can only change your username once every 30 days.
                            </Text>
                        </View>

                        <Button label="DONE" onPress={handleChangeUsernamePress} />
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
