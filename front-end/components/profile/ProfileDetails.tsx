import { StyleSheet, Text, View } from "react-native";
import Avatar from "./Avatar";
import { UnitType } from "../../libs/catalogs/register";

type ProfileDetailsProps = {
    avatarUrl: string;
    username: string;
    age: number;
    goal: string;
    weight: number;
    weightUnitType: UnitType;
};

export default function ProfileDetails({ avatarUrl, username, age, goal, weight, weightUnitType }: ProfileDetailsProps) {
    const weightUnitTypeLabel = weightUnitType === "IMPERIAL" ? "LB" : "KG"

    console.log(avatarUrl);

    return (
        <View style={styles.layout}>
            <Avatar avatarUrl={avatarUrl} />
            <Text style={[styles.detailsTitle, { marginTop: 10 }]}>Username</Text>
            <Text style={[styles.detailsData, { marginBottom: 10 }]}>{username}</Text>
            <View style={styles.detailsLayout}>
                <View style={styles.details}>
                    <Text style={styles.detailsTitle}>Age</Text>
                    <Text style={styles.detailsData}>{age}</Text>
                </View>
                <View style={styles.details}>
                    <Text style={styles.detailsTitle}>Goal</Text>
                    <Text style={styles.detailsData}>{goal}</Text>
                </View>
                <View style={styles.details}>
                    <Text style={styles.detailsTitle}>Weight</Text>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={styles.detailsData}>{weight}</Text>
                        <Text style={styles.unit}>{weightUnitTypeLabel}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    layout: {
        justifyContent: "center",
        alignItems: "center",
    },
    detailsLayout: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 24
    },
    details: {
        flex: 1,
        alignItems: "center"
    },
    detailsTitle: {
        fontSize: 14,
        color: "green"
    },
    detailsData: {
        fontSize: 20,
        fontWeight: "bold",
        color: "green",
        textAlign: "center"
    },
    unit: {
        fontSize: 12,
        color: "green",
        fontWeight: "700"
    }
})