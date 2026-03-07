import { Pressable, Text, View } from "react-native";
import { SearchModeType } from "../../../../libs/types/threads/SearchModeType";
import { styles } from "./styles";

type SearchFiltersProps = {
    onPressThreads: () => void;
    onPressProfiles: () => void;
    mode: SearchModeType;
}

export default function SearchFilters({ onPressThreads, onPressProfiles, mode }: SearchFiltersProps) {

    return (
        <View style={styles.container}>
            <Pressable onPress={onPressThreads} style={[styles.button, mode === "threads" && styles.buttonActive]} >
                <Text style={[styles.text, mode === "threads" && styles.textActive]}>THREADS</Text>
            </Pressable>

            <Pressable onPress={onPressProfiles} style={[styles.button, mode === "profiles" && styles.buttonActive]} >
                <Text style={[styles.text, mode === "profiles" && styles.textActive]}>PROFILES</Text>
            </Pressable>
        </View>
    );
}