import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/auth/login/LoginScreen";
import RegisterScreen from "../screens/auth/register/RegisterScreen";
import ForgotPasswordScreen from "../screens/auth/forgot-password/ForgotPasswordScreen";
import WelcomeScreen from "../screens/auth/welcome/WelcomeScreen";
import EmailVerificationScreen from "../screens/auth/email-verification/EmailVerificationScreen";

export type AuthStackParamList = {
    Welcome: undefined;
    Register: undefined;
    Login: undefined;
    ForgotPassword: undefined;
    EmailVerification: {
        email?: string;
        autoSend?: boolean;
        noticeMessage?: string;
        noticeSuccess?: boolean;
    } | undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
    return (
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
        </Stack.Navigator>
    );
}
