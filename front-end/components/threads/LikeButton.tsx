import { Pressable, View, Animated } from "react-native";
import { HeartIcon as HeartIconSolid } from "react-native-heroicons/solid";
import { HeartIcon as HeartIconOutline } from "react-native-heroicons/outline";
import { useEffect, useRef } from "react";

type LikeButtonProps = {
    liked: boolean;
    likeCount: number;
    loading?: boolean;
    onPress: () => void;
};

export default function LikeButton({ liked, likeCount, loading = false, onPress }: LikeButtonProps) {
    const anim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        anim.setValue(0.85);
        Animated.spring(anim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 18,
            bounciness: 6,
        }).start();
    }, [likeCount, anim]);

    return (
        <Pressable onPress={onPress} disabled={loading} style={{ paddingVertical: 6, paddingHorizontal: 6 }}>
            <View style={[{ flexDirection: "row", alignItems: "center", gap: 6 }, loading && { opacity: 0.6 }]}>
                {liked ? <HeartIconSolid color="red" /> : <HeartIconOutline color="gray" />}
                <Animated.Text
                    style={[
                        { color: "gray", minWidth: 24 },
                        liked && { color: "red" },
                        { transform: [{ scale: anim }], opacity: anim },
                    ]}
                    numberOfLines={1}
                >
                    {likeCount}
                </Animated.Text>
            </View>
        </Pressable>
    );
}