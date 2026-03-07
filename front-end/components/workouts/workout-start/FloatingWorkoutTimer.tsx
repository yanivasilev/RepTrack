import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, PanResponder, Text, Dimensions, Pressable, StatusBar, Platform, } from "react-native";
import { useWorkout } from "../../../hooks/WorkoutSessionContext";
import { getElapsedMs } from "../../../libs/storage/workoutSession";
import { formatToWorkoutTimer } from "../../../libs/helpers/time/formatToWorkoutTimer";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const BOX_WIDTH = 120;
const BOX_HEIGHT = 64;

// HPW MUCH SPACE TO KEEP FROM EDGES
const EDGE_PADDING = 10;

const TOP_SAFE = Platform.select({
  android: (StatusBar.currentHeight ?? 0) + EDGE_PADDING,
  ios: 44 + EDGE_PADDING,
  default: EDGE_PADDING,
});

// KEEPING IT ABOVE BOTTOM NAVIGATION
const BOTTOM_SAFE = 90;

function clamp(v: number, min: number, max: number) {
  "worklet";
  return Math.max(min, Math.min(v, max));
}

export default function FloatingWorkoutTimer({ onPress }: { onPress: () => void }) {
  const { session } = useWorkout();
  const [now, setNow] = useState(Date.now());

  // STARTING POSITION
  const pos = useRef(new Animated.ValueXY({ x: EDGE_PADDING, y: TOP_SAFE + 80 })).current;

  // TRACKING LAST POSITION
  const last = useRef({ x: EDGE_PADDING, y: TOP_SAFE + 80 });

  const bounds = useMemo(() => {
    const minX = EDGE_PADDING;
    const maxX = SCREEN_WIDTH - BOX_WIDTH - EDGE_PADDING;

    const minY = TOP_SAFE;
    const maxY = SCREEN_HEIGHT - BOX_HEIGHT - BOTTOM_SAFE;

    return { minX, maxX, minY, maxY };
  }, []);

  useEffect(() => {
    if (!session) return;

    const id = setInterval(() => setNow(Date.now()), 500);

    return () => clearInterval(id);
  }, [session]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        // ANIMATION STOPS WHEN USER GRABS IT
        pos.stopAnimation();
      },

      onPanResponderMove: (_, gesture) => {
        // CALCULATE NEW POSITION RELATING TO LAST ONE
        const newX = clamp(last.current.x + gesture.dx, bounds.minX, bounds.maxX);
        const newY = clamp(last.current.y + gesture.dy, bounds.minY, bounds.maxY);

        pos.setValue({ x: newX, y: newY });
      },

      onPanResponderRelease: (_, gesture) => {
        const releasedY = clamp(last.current.y + gesture.dy, bounds.minY, bounds.maxY);

        const releasedX = clamp(last.current.x + gesture.dx, bounds.minX, bounds.maxX);
        const middle = SCREEN_WIDTH / 2;

        const snapX =
          releasedX + BOX_WIDTH / 2 < middle ? bounds.minX : bounds.maxX;

        Animated.spring(pos, {
          toValue: { x: snapX, y: releasedY },
          useNativeDriver: false,
          bounciness: 8,
          speed: 18
        }).start(() => {
          last.current = { x: snapX, y: releasedY };
        });
      },
    })
  ).current;

  if (!session) return null;

  const elapsed = Math.max(0, getElapsedMs(session, now));

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        width: BOX_WIDTH,
        height: BOX_HEIGHT,
        elevation: 8,
        zIndex: 999,
      }}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          width: "100%",
          height: "100%",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderRadius: 18,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: pressed ? "darkgreen" : "green",
          opacity: pressed ? 0.9 : 1
        })}
      >
        <Text style={{ color: "white", fontWeight: "800", fontSize: 18 }}>
          {formatToWorkoutTimer(elapsed)}
        </Text>
        <Text style={{ color: "white", fontSize: 12, fontWeight: "800" }}>
          TAP TO OPEN
        </Text>
      </Pressable>
    </Animated.View>

  );
}
