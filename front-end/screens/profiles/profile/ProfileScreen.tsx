import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useState } from "react";
import { styles } from "./styles";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfilesParamList } from "../../../navigation/ProfilesNavigator";
import { getProfileApi } from "../../../services/api/profiles/getProfileApi";
import SettingsButton from "../../../components/buttons/SettingsButton";
import { fitnessGoalToLabel } from "../../../libs/helpers/fitnessGoalToLabel";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import { ProfileDetailsType } from "../../../libs/types/profiles/ProfileDetailsType";
import ProfileDetails from "../../../components/profiles/ProfileDetails";
import ProfileActivity from "../../../components/profiles/profile-activity/ProfileActivity";
import ProfileBadges from "../../../components/profiles/profile-badges/ProfileBadges";

type Props = NativeStackScreenProps<ProfilesParamList, "Profile">;

export default function ProfileScreen({ navigation, route }: Props) {
    const [user, setUser] = useState<ProfileDetailsType | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await getProfileApi();
            setUser(res);
            console.log("res", JSON.stringify(res, null, 2));
            console.log("user", JSON.stringify(user, null, 2));
        } catch (error: any) {
            setError(error?.message ?? "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchProfile();
        }, [fetchProfile])
    );

    if (loading) return <Loading message="Loading profile..." />

    if (error || !user) return <Error error={error ?? "Something went wrong."} />

    return (
        <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
            <View style={styles.root}>
                <SettingsButton onPress={() => navigation.navigate("Settings")} />

                <View style={styles.container}>
                    <ProfileActivity
                        userId={user.id}
                        initialMode={route.params?.activityMode ?? "threads"}
                        header={
                            <>
                                <ProfileDetails
                                    avatarFileName={user.avatarFileName}
                                    username={user.username}
                                    age={user.age}
                                    goal={fitnessGoalToLabel(user.fitnessGoal)}
                                    weight={user.weight}
                                    weightUnitType={user.weightUnitType}
                                />

                                <ProfileBadges badges={user.badges ?? []} weightUnitType={user.weightUnitType} />
                            </>
                        }
                        onOpenThread={({ threadId, sourceActivityMode, onThreadUpdated, onThreadDeleted, onReplyUpdated }) =>
                            navigation.getParent()?.navigate("Threads", {
                                screen: "ThreadDetails",
                                params: { threadId, onThreadUpdated, onThreadDeleted, onReplyUpdated, source: "profile", returnActivityMode: sourceActivityMode },
                            } as never)
                        }
                        onOpenUserProfile={(userId) =>
                            navigation.navigate("UserProfile", { userId, source: "profile" })
                        }
                        showEditedLabel={true}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}
