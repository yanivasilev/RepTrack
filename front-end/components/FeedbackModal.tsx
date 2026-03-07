import { ActivityIndicator, ScrollView, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Badge } from "../libs/types/badges/Badge";
import { getBadgeIcon } from "../libs/helpers/getBadgeIcon";
import { getBadgeShortLabel } from "../libs/helpers/getBadgeShortLabel";

type FeedbackModalProps = {
    visible: boolean;
    loading?: boolean;
    loadingMessage?: string;
    message?: string;
    success?: boolean;
    badges?: Badge[];
    onClose: () => void;
};

export default function FeedbackModal({ visible, loading = false, loadingMessage, message, success = false, badges = [], onClose }: FeedbackModalProps) {
    if (!visible) return null;

    return (
        <Modal visible transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={!loading && styles.box}>
                    {loading ? (
                        <View style={styles.loadingWrap}>
                            <ActivityIndicator size="large" color="#22c55e" />
                            <Text style={[styles.text, { color: "#22c55e" }]}>
                                {loadingMessage ?? "Loading..."}
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.contentWrap}>
                            <Text style={[styles.text, { color: success ? "green" : "red" }]}>
                                {message}
                            </Text>

                            {badges.length > 0 && (
                                <View style={styles.badgesWrap}>
                                    <Text style={styles.badgesTitle}>New badges earned</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesScroll}>
                                        {badges.map((badge) => (
                                            <View key={badge.type} style={styles.badgeCard}>
                                                {getBadgeIcon(badge.icon, getBadgeShortLabel(badge.type), 56)}
                                                <Text style={styles.badgeName} numberOfLines={2}>{badge.name}</Text>
                                            </View>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>
                    )}

                    {!loading && (
                        <Pressable
                            onPress={onClose}
                            style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
                        >
                            <Text style={styles.closeText}>CLOSE</Text>
                        </Pressable>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
    },
    box: {
        width: "90%",
        backgroundColor: "white",
        paddingVertical: 20,
        paddingHorizontal: 24,
        borderRadius: 16,
        alignItems: "center",
    },
    text: {
        fontSize: 16,
        textAlign: "center",
    },
    contentWrap: {
        width: "100%",
        gap: 10,
    },
    loadingWrap: {
        alignItems: "center",
        gap: 10,
    },
    badgesWrap: {
        marginTop: 2,
        gap: 8,
        width: "100%",
    },
    badgesTitle: {
        color: "green",
        fontSize: 14,
        fontWeight: "800",
        textAlign: "center",
    },
    badgesScroll: {
        gap: 8,
        paddingHorizontal: 2,
    },
    badgeCard: {
        width: 90,
        alignItems: "center",
        paddingVertical: 6,
        paddingHorizontal: 4,
        borderWidth: 1,
        borderColor: "#d9d9d9",
        borderRadius: 10,
        backgroundColor: "white",
    },
    badgeName: {
        marginTop: 4,
        color: "#374151",
        fontSize: 11,
        fontWeight: "700",
        textAlign: "center",
    },
    closeButton: {
        marginTop: 16,
        paddingVertical: 10,
        paddingHorizontal: 24,
        backgroundColor: "gray",
        borderRadius: 12,
    },
    closeButtonPressed: {
        opacity: 0.6
    },
    closeText: {
        color: "white",
        fontWeight: "bold",
    },
});
