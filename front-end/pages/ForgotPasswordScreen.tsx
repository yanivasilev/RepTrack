import { View, Text, Pressable, StyleSheet, Image, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Input from "../components/Input";
import Button from "../components/Button";
import UnderlineButton from "../components/UnderlineButton";

type Props = NativeStackScreenProps<RootStackParamList, "ForgotPassword">;

export default function ForgotPasswordScreen({ navigation }: Props) {
    const [email, setEmail] = useState("");

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.root}>

                {/* BACK BUTTON */}
                <Pressable
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    hitSlop={10}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </Pressable>

                {/* TOP SECTION */}
                <View style={styles.topSection} >
                    <Image
                        source={require("../assets/logo.png")}
                        style={styles.logo}
                    />

                    <View>
                        <Text style={styles.title}>
                            <Text style={styles.rep}>Rep</Text>
                            <Text style={styles.track}>Track</Text>
                        </Text>
                        <Text style={styles.subtitle}>Perfect your form, get stronger, one session at a time. Your smarter workoutstarts here</Text>
                    </View>
                </View>

                <Text style={styles.heading}>FORGOT PASSWORD</Text>

                {/* CONTENT */}

                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    enableAutomaticScroll
                    enableOnAndroid
                >
                    <View style={[styles.content, { rowGap: 15 }]}>
                        <Text style={{ textAlign: "center", color: "gray" }}>Enter your email and we'll send you a verification code to reset your password.</Text>
                        <Input
                            label='Email'
                            value={email}
                            onTextChange={setEmail}
                            placeholder='Enter email'
                        />
                    </View>
                </KeyboardAwareScrollView>
            </View>

            {/* BUTTONS */}
            <View style={{ paddingHorizontal: 30 }}>
                <View style={{ rowGap: 15 }}>
                    <Button label="SEND RESET CODE" onPress={() => console.log("PRESSED: SEND RESET CODE!")} />
                </View>
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#fff",
    },
    root: {
        flex: 1,
        backgroundColor: "#fff",
    },
    topSection: {
        alignItems: "center",
        paddingHorizontal: 30,
        paddingTop: 20,
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: "center"
    },
    backButton: {
        position: "absolute",
        top: 16,
        left: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "green",
        backgroundColor: "green",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
    },
    logo: {
        width: 120,
        height: 120,
        alignSelf: "center",
        marginBottom: 16,
    },
    title: {
        fontSize: 42,
        fontWeight: "bold",
        color: "green",
        textAlign: "center",
    },
    rep: {
        color: "gray",
    },
    track: {
        color: "green",
    },
    subtitle: {
        color: "green",
        textAlign: "center",
        marginBottom: 24,
    },
    heading: {
        fontSize: 32,
        fontWeight: "bold",
        color: "green",
        textAlign: "center",
        marginBottom: 24,
    },
});
