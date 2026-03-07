import { Pressable, Text, View } from "react-native";
import { formatSeconds } from "../../../../libs/helpers/time/formatSeconds";
import { styles } from "./styles";
import { ChevronDoubleRightIcon } from "react-native-heroicons/outline";

type WorkoutCardProps = {
    startedAt: Date;
    durationSeconds: number;
    exerciseCount: number;
    setCount: number;
    notes: string | undefined;
    onPress: () => void;
}

export default function WorkoutCard({ startedAt, durationSeconds, exerciseCount, setCount, notes, onPress }: WorkoutCardProps) {
    const date = startedAt.toLocaleDateString();
    const duration = formatSeconds(durationSeconds);

    return (
        <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
            {({ pressed }) => (
                <View style={styles.content}>
                    {/* DATE */}
                    <Text style={[styles.date, pressed && styles.datePressed]}>
                        {date}
                    </Text>

                    {/* DURATION */}
                    <Text style={styles.statText}>
                        <Text style={styles.statLabel}>Duration:</Text> {duration}
                    </Text>

                    {/* EXERCISE COUNT */}
                    <Text style={styles.statText}>
                        <Text style={styles.statLabel}>Exercises:</Text> {exerciseCount}
                    </Text>

                    {/* SET COUNT */}
                    <Text style={styles.statText}>
                        <Text style={styles.statLabel}>Sets:</Text> {setCount}
                    </Text>

                    <View>
                        <Text style={styles.notesLabel}>Notes:</Text>
                        <Text style={styles.notesText} numberOfLines={1} ellipsizeMode="tail"    >
                            {notes ? notes : "None"}
                        </Text>
                    </View>

                    <View style={[styles.hintContainer, pressed && styles.hintContainerPressed]}>
                        <ChevronDoubleRightIcon color={pressed ? "#dfdfdf" : "white"} strokeWidth={3} />
                        <Text style={[styles.hint, pressed && styles.hintPressed]}>
                            TAP TO VIEW DETAILS
                        </Text>
                    </View>
                </View>

            )}
        </Pressable>
    );
}
