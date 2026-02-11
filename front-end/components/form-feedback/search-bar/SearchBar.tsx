import { Pressable, Text, TextInput, View } from "react-native";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { styles } from "./styles";

type SearchBarProps = {
    query: string;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
};

export default function SearchBar({ query, setQuery }: SearchBarProps) {
    return (
        <View style={styles.searchBox}>
            <MagnifyingGlassIcon size={24} strokeWidth={3} color="green" />

            <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search exercises..."
                placeholderTextColor="#888"
                style={styles.searchInput}
                returnKeyType="search"
            />

            {!!query.trim() && (
                <Pressable onPress={() => setQuery("")} style={styles.searchClearButton}>
                    <Text style={styles.searchClearText}>Clear</Text>
                </Pressable>
            )}
        </View>
    );
}
