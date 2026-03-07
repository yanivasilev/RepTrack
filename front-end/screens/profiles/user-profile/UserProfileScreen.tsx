import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useState } from "react";
import { styles } from "./styles";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfilesParamList } from "../../../navigation/ProfilesNavigator";
import { fitnessGoalToLabel } from "../../../libs/helpers/fitnessGoalToLabel";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import { getProfileByIdApi } from "../../../services/api/profiles/getProfileByIdApi";
import BackButton from "../../../components/buttons/BackButton";
import { ProfileDetailsType } from "../../../libs/types/profiles/ProfileDetailsType";
import ProfileDetails from "../../../components/profiles/ProfileDetails";
import ProfileActivity from "../../../components/profiles/profile-activity/ProfileActivity";
import ProfileBadges from "../../../components/profiles/profile-badges/ProfileBadges";

type Props = NativeStackScreenProps<ProfilesParamList, "UserProfile">;

export default function UserProfileScreen({ navigation, route }: Props) {
    const { userId, source } = route.params;

    const [user, setUser] = useState<ProfileDetailsType | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await getProfileByIdApi(userId);
            setUser(res);
        } catch (error: any) {
            setError(error?.message ?? "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }, [userId]);

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
                <View style={styles.container}>
                    <BackButton
                        navigation={navigation}
                        onPress={() => {
                            if (source === "threads") {
                                navigation.getParent()?.navigate("Threads", { screen: "ThreadsMain" });
                                return;
                            }

                            if (source === "threadsSearch") {
                                navigation.getParent()?.navigate("Threads", { screen: "ThreadsSearch" });
                                return;
                            }

                            if (source === "profile") {
                                navigation.navigate("Profile");
                                return;
                            }

                            navigation.goBack();
                        }}
                    />
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
                                params: {
                                    threadId,
                                    onThreadUpdated,
                                    onThreadDeleted,
                                    onReplyUpdated,
                                    source: "userProfile",
                                    sourceUserId: user.id,
                                    returnActivityMode: sourceActivityMode,
                                },
                            } as never)
                        }
                        onOpenUserProfile={(nextUserId) => {
                            if (nextUserId === user.id) return;
                            navigation.navigate("UserProfile", { userId: nextUserId });
                        }}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}
