import { Pressable, Text } from "react-native";
import { styles } from "./styles";
import Avatar from "../../../profiles/Avatar";

type ProfileCardProps = {
    onPress: () => void;
    avatarFileName: string;
    username: string;
}

export default function ProfileCard({ onPress, avatarFileName, username }: ProfileCardProps) {
    return (
        <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
            <Avatar avatarFileName={avatarFileName} size={40} borderWidth={1} borderColor="green" />
            <Text style={styles.username}>{username}</Text>
        </Pressable>
    );
}