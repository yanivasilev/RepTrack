import { useMemo, useState } from "react";
import { FlatList, Modal, Text, View } from "react-native";
import { BADGE_CATALOG } from "../../../libs/data/badges";
import { UserBadge } from "../../../libs/types/badges/UserBadge";
import Button from "../../buttons/Button";
import { styles } from "./styles";
import { getBadgeIcon } from "../../../libs/helpers/getBadgeIcon";
import { getBadgeShortLabel } from "../../../libs/helpers/getBadgeShortLabel";
import { UnitType } from "../../../libs/types/common/UnitType";
import { formatVolumeLabel } from "../../../libs/helpers/formatVolumeLabel";

type ProfileBadgesProps = {
    badges: UserBadge[];
    weightUnitType: UnitType;
};

export default function ProfileBadges({ badges, weightUnitType }: ProfileBadgesProps) {
    const [open, setOpen] = useState(false);

    const earnedByType = useMemo(() => {
        const map = new Map<UserBadge["type"], UserBadge>();
        badges.forEach((badge) => map.set(badge.type, badge));
        return map;
    }, [badges]);

    const catalogByType = useMemo(
        () => new Map(BADGE_CATALOG.map((b) => [b.type, b])),
        []
    );

    const earnedCount = earnedByType.size;
    const totalCount = BADGE_CATALOG.length;

    const earnedItems = useMemo(() => {
        return badges
            .slice()
            .sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime())
            .map((earned) => {
                const catalog = catalogByType.get(earned.type);
                const volume = catalog?.weight ? formatVolumeLabel(catalog.weight, weightUnitType) : null;

                return {
                    ...earned,
                    volumeLabel: volume?.compact ?? null,
                };
            });
    }, [badges, catalogByType, weightUnitType]);

    return (
        <View style={styles.section}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>Badges</Text>
                <Text style={styles.count}>{earnedCount}/{totalCount}</Text>
            </View>

            {earnedItems.length === 0 ? (
                <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>No badges earned yet.</Text>
                </View>
            ) : (
                <FlatList
                    horizontal
                    data={earnedItems}
                    keyExtractor={(item) => item.type}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.earnedList}
                    renderItem={({ item }) => (
                        <View style={styles.earnedCard}>
                            {getBadgeIcon(item.icon, getBadgeShortLabel(item.type), 64)}
                            <Text style={styles.badgeName} numberOfLines={2}>{item.name}</Text>
                            {item.volumeLabel && (
                                <Text style={styles.badgeSub} numberOfLines={1}>{item.volumeLabel}</Text>
                            )}
                        </View>
                    )}
                />
            )}

            <Button label="VIEW ALL BADGES" colour="green" onPress={() => setOpen(true)} />

            <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
                <View style={styles.overlay}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>All Badges</Text>
                            <Text style={styles.modalSubtitle}>Earned {earnedCount} of {totalCount}</Text>
                        </View>

                        <FlatList
                            data={BADGE_CATALOG}
                            keyExtractor={(item) => item.type}
                            contentContainerStyle={styles.allList}
                            renderItem={({ item }) => {
                                const earned = earnedByType.get(item.type);
                                const icon = earned?.icon ?? item.icon;
                                const name = earned?.name ?? item.name;
                                const shortLabel = getBadgeShortLabel(item.type);
                                const volume = item.weight ? formatVolumeLabel(item.weight, weightUnitType) : null;

                                return (
                                    <View style={[styles.allItem, !earned && styles.allItemLocked]}>
                                        {getBadgeIcon(icon, shortLabel, 56)}

                                        <View style={styles.allItemTextWrap}>
                                            <Text style={styles.allItemTitle}>{name}</Text>
                                            <Text style={earned ? styles.statusEarned : styles.statusLocked}>
                                                {earned ? "Earned" : "Locked"}
                                            </Text>
                                            {volume && (
                                                <Text style={styles.targetText}>
                                                    Target: {volume.compact}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                );
                            }}
                        />

                        <View style={{ marginTop: 20 }}>
                            <Button label="CLOSE" colour="green" onPress={() => setOpen(false)} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
