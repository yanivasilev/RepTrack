import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Dimensions, Modal, Pressable, KeyboardAvoidingView, Platform, View } from "react-native";
import SearchBar from "../../../common/search-bar/SearchBar";
import ExercisesList from "../../../common/exercises-list/ExercisesList";
import { Exercise } from "../../../../libs/types/common/exercises/Exercise";
import { getAllExercisesApi } from "../../../../services/api/exercises/getAllExercisesApi";
import { styles } from "./styles";
import Loading from "../../../Loading";
import Error from "../../../Error";
import FeedbackModal from "../../../FeedbackModal";
import Button from "../../../buttons/Button";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_MAX_HEIGHT = Math.min(SCREEN_HEIGHT * 0.85, 700);

type AddExerciseProps = {
    visible: boolean;
    onClose: () => void;
    onSelect: (exercise: Exercise) => Promise<void> | void;
    selectedExercises: Set<string>;
}

export default function AddExercise({ visible, onClose, onSelect, selectedExercises }: AddExerciseProps) {
    const [query, setQuery] = useState("");
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
    const [page, setPage] = useState(1);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(false);
    type LoadingMode = "none" | "search" | "more";
    const [loadingMode, setLoadingMode] = useState<LoadingMode>("none");
    const [error, setError] = useState<string | null>(null);
    const [adding, setAdding] = useState(false);
    const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);
    const skipNextQueryFetch = useRef(false);

    const loadMoreExercises = !loading && page < totalPages;

    // ANIMATION
    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

    const openAddExercise = () => {
        Animated.timing(translateY, {
            toValue: 0,
            duration: 220,
            useNativeDriver: true,
        }).start();
    };

    const closeAddExercise = () => {
        Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 180,
            useNativeDriver: true,
        }).start(() => {
            onClose();
        });
    };

    // FETCHING EXERCISES
    async function fetchExercises(opts?: { reset?: boolean; pageOverride?: number }) {
        const reset = opts?.reset ?? false;
        const nextPage = opts?.pageOverride ?? (reset ? 1 : page);

        setError(null);
        setLoading(true);
        setLoadingMode(reset ? "search" : "more");

        try {
            const res = await getAllExercisesApi({
                page: nextPage,
                limit: 20,
                query: query.trim() || undefined,
            });

            setTotalPages(res.totalPages);

            if (reset) {
                setExercises(res.items);
                setPage(1);
            } else {
                setExercises((prev) => [...prev, ...res.items]);
                setPage(nextPage);
            }
        } catch (e: any) {
            const message = e?.message ?? "Failed to load exercises.";
            setError(message);
            if (!reset && exercises.length > 0) {
                setFeedback({ text: message, success: false });
            }
        } finally {
            setLoading(false);
            setLoadingMode("none");
        }
    }

    // LOADING MORE EXERCISES
    async function LoadMoreExercises() {
        if (!loadMoreExercises) return;
        await fetchExercises({ reset: false, pageOverride: page + 1 });
    }

    // LOAD ONLY WHEN MODAL IS VISIBLE
    useEffect(() => {
        if (!visible) return;

        skipNextQueryFetch.current = true;
        setQuery("");
        setSelectedExercise(null);
        setExercises([]);
        setPage(1);
        setTotalPages(1);

        openAddExercise();
        fetchExercises({ reset: true });
    }, [visible]);

    // LOADING EXERCISES ON QUERY CHANGE
    useEffect(() => {
        if (!visible) return;
        if (skipNextQueryFetch.current) {
            skipNextQueryFetch.current = false;
            return;
        }

        const t = setTimeout(() => {
            fetchExercises({ reset: true });
        }, 350);

        return () => clearTimeout(t);
    }, [query, visible]);

    const visibleExercises = useMemo(() => {
        return exercises.filter((ex) => !selectedExercises.has(String(ex.id)));
    }, [exercises, selectedExercises]);

    const isFirstLoad = loading && loadingMode === "search" && exercises.length === 0;

    const handleSelect = async (exercise: Exercise) => {
        try {
            setAdding(true);
            setFeedback(null);
            await onSelect(exercise);
            closeAddExercise();
        } catch (e: any) {
            setFeedback({
                text: e?.message ?? "Failed to add exercise.",
                success: false,
            });
        } finally {
            setAdding(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={closeAddExercise}
            presentationStyle="overFullScreen"
            statusBarTranslucent
        >
            {/* TRANSPARENT BACKGROUND */}
            <Pressable onPress={closeAddExercise} style={styles.background}>

                {/* PREVENTS CLOSING WHEN PRESSING INSIDE THE MODAL */}
                <Pressable onPress={() => { }} style={{ width: "100%" }}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={{ flex: 1, justifyContent: "flex-end" }}
                        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
                    >
                        <Animated.View style={[styles.animatedView, { transform: [{ translateY }], height: SHEET_MAX_HEIGHT }]}>

                            <View style={styles.addExerciseBox} />

                            <SearchBar query={query} setQuery={setQuery} />

                            <View style={styles.exerciseList}>
                                {isFirstLoad ? (
                                    <Loading message="Loading exercises..." />
                                ) : error && visibleExercises.length === 0 ? (
                                    <Error error={error} />
                                ) : (
                                    <ExercisesList
                                        exercises={visibleExercises}
                                        selectedExercise={selectedExercise}
                                        setSelectedExercise={setSelectedExercise}
                                        onEndReached={LoadMoreExercises}
                                        loadingMore={loading && loadingMode === "more"}
                                        loadingSearch={loading && loadingMode === "search"}
                                    />
                                )}
                            </View>

                            <View style={{ paddingTop: 10 }}>
                                {/* ADD SELECTED EXERCISE BUTTON */}
                                <Button
                                    label={adding ? "ADDING..." : selectedExercise ? "ADD SELECTED" : "SELECT AN EXERCISE"}
                                    disabled={!selectedExercise || adding}
                                    onPress={async () => {
                                        if (!selectedExercise) return;
                                        await handleSelect(selectedExercise);
                                    }}
                                    colour="green"
                                />

                                {/* CLOSE BUTTON */}
                                <Button label="CLOSE" onPress={closeAddExercise} colour="gray" />
                            </View>

                        </Animated.View>
                    </KeyboardAvoidingView>
                </Pressable>
            </Pressable>

            <FeedbackModal
                visible={Boolean(feedback)}
                loading={false}
                message={feedback?.text}
                success={feedback?.success}
                onClose={() => setFeedback(null)}
            />
        </Modal>
    );
}
