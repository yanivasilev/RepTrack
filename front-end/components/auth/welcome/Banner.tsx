import { Image, StyleSheet, Text, View } from 'react-native';

export default function Banner() {

    return (
        <View style={styles.view} >
            <Image
                source={require("../../../assets/logo.png")}
                style={styles.logo}
            />

            <View>
                <Text style={styles.title}>
                    <Text style={styles.rep}>Rep</Text>
                    <Text style={styles.track}>Track</Text>
                </Text>
                <Text style={styles.subtitle}>Perfect your form, get stronger, one session at a time. Your smarter workout starts here</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        paddingHorizontal: 30,
        paddingTop: 20,
    },
    logo: {
        width: 120,
        height: 120,
        alignSelf: "center",
        marginBottom: 16
    },
    title: {
        fontSize: 42,
        fontWeight: "bold",
        color: "green",
        textAlign: "center"
    },
    rep: {
        color: "gray"
    },
    track: {
        color: "green"
    },
    subtitle: {
        color: "green",
        textAlign: "center",
        marginBottom: 24
    }
});
