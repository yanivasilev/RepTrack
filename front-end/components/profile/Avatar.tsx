import React from "react";
import { View, Image } from "react-native";

type Props = {
  avatarUrl: string;
};

export default function Avatar({ avatarUrl }: Props) {
  return (
    <View style={{ justifyContent: "center", alignItems: "center", gap: 10 }}>
      <View
        style={{
          position: "relative",
          width: 120,
          height: 120
        }}
      >
        <Image
          source={{ uri: avatarUrl }}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            borderWidth: 3,
            borderColor: "green",
          }}
        />
      </View>
    </View>
  );
}
