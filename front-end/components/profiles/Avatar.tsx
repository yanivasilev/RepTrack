import React, { useState } from "react";
import { Image, View, StyleProp, ViewStyle } from "react-native";
import { BASE_URLS, ENV } from "../../services/api/customApi/client";

type Props = {
  avatarFileName: string | null;
  size?: number;
  borderWidth?: number;
  borderColor?: string;
  style?: StyleProp<ViewStyle>;
};

export default function Avatar({ avatarFileName, size = 44, borderWidth = 0, borderColor = "transparent", style }: Props) {
  const [failed, setFailed] = useState(false);
  const fileName = (avatarFileName && !failed) ? avatarFileName : "default-avatar.webp";
  const imageSource = { uri: `${BASE_URLS[ENV]}/uploads/avatars/${fileName}` };

  return (
    <View style={[{ width: size, height: size, borderRadius: size / 2, borderWidth, borderColor, overflow: "hidden", backgroundColor: "#EAEAEA" }, style]}>
      <Image
        source={imageSource}
        resizeMode="cover"
        style={{ width: "100%", height: "100%" }}
        onError={() => setFailed(true)}
      />
    </View>
  );
}
