import React from "react";
import { Alert, Text, View } from "react-native";
import { PlayIcon, PauseIcon, FolderPlusIcon, ArrowPathIcon, } from "react-native-heroicons/solid";
import { useWorkout } from "../../../../hooks/WorkoutSessionContext";
import Button from "../../../buttons/Button";

type Props = {
    timer: string
    onSaveWorkout: () => Promise<boolean>;
};

export default function Controls({ timer, onSaveWorkout }: Props) {
    const { session, start, pause, resume } = useWorkout();

    const isRunning = session?.status === "running";
    const isPaused = session?.status === "paused";
    const noExercises = session?.exercises.length === 0;

    const handleSavePress = () => {
        Alert.alert("Save Workout", "Are you sure you want to save this workout?", [
            { text: "Cancel", style: "destructive" },
            { text: "Save", style: "default", onPress: () => { void onSaveWorkout(); } },
        ]);
    };

    return (
        <View>
            <View style={{ alignItems: "center" }}>
                <Text style={{ color: "green", fontSize: 34, fontWeight: "900" }}>
                    {timer}
                </Text>
            </View>

            {noExercises && (
                <Text style={{ textAlign: "center", marginBottom: 10, color: "gray" }}>
                    Add at least one exercise to save your workout.
                </Text>
            )}

            {/* BUTTONS */}
            <View style={{ flexDirection: "row", gap: 10 }}>
                {!session && (
                    <View style={{ flex: 1 }}>
                        <Button label="START" onPress={() => { void start(); }} colour="green" Icon={PlayIcon} />
                    </View>
                )}

                {isRunning && (
                    <>
                        <View style={{ flex: 1 }}>
                            <Button
                                label="PAUSE"
                                onPress={() => { void pause(); }}
                                Icon={PauseIcon}
                                colour="orange"
                            />
                        </View>

                        <View style={{ flex: 1 }}>
                            <Button
                                label="SAVE"
                                onPress={handleSavePress}
                                Icon={FolderPlusIcon}
                                colour="green"
                                disabled={noExercises}
                            />
                        </View>
                    </>
                )}

                {isPaused && (
                    <>
                        <View style={{ flex: 1 }}>
                            <Button
                                label="RESUME"
                                colour="gray"
                                onPress={() => { void resume(); }}
                                Icon={ArrowPathIcon}
                            />
                        </View>

                        <View style={{ flex: 1 }}>
                            <Button
                                label="SAVE"
                                onPress={handleSavePress}
                                Icon={FolderPlusIcon}
                                colour="green"
                                disabled={noExercises}
                            />
                        </View>
                    </>
                )}
            </View>
        </View>
    );
}
