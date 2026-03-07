import { StyleSheet, Text, View } from "react-native";
import Avatar from "./Avatar";
import { UnitType } from "../../libs/types/common/UnitType";
import { convertWeight } from "../../libs/helpers/convertWeight";

type ProfileDetailsProps = {
    avatarFileName: string;
    username: string;
    age: number;
    goal: string;
    weight: number;
    weightUnitType: UnitType;
};

export default function ProfileDetails({ avatarFileName, username, age, goal, weight, weightUnitType }: ProfileDetailsProps) {
    const weightUnitTypeLabel = weightUnitType === "IMPERIAL" ? "LB" : "KG";
    const displayWeight =
        weightUnitType === "IMPERIAL"
            ? Math.round(convertWeight(weight, "METRIC", "IMPERIAL"))
            : weight;

    return (
        <View style={styles.layout}>
            <Avatar avatarFileName={avatarFileName} size={120} borderWidth={3} borderColor="green" />
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
                        <Text style={styles.detailsData}>{displayWeight}</Text>
                        <Text style={styles.unit}>{weightUnitTypeLabel}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    layout: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    detailsLayout: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        maxWidth: 420,
        paddingHorizontal: 24,
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
