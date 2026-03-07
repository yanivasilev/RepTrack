import { View } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Input from '../../inputs/Input';
import { useState } from 'react';
import { LoginFormType } from '../../../libs/types/auth/LoginFormType';

type LoginFormProps = {
    data: LoginFormType;
    setData: (fields: Partial<LoginFormType>) => void;
    errors: Partial<Record<keyof LoginFormType, string>>;
}

export default function LoginForm({ data, setData, errors }: LoginFormProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            enableAutomaticScroll={false}
            enableOnAndroid
        >
            <View
                style={{
                    rowGap: 15,
                    flex: 1,
                    paddingHorizontal: 30,
                    justifyContent: "center"
                }}
            >
                <Input
                    label='Email'
                    value={data.email}
                    onChangeText={(val) => setData({ email: val })}
                    placeholder='Enter email'
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="emailAddress"
                    autoComplete="email"
                    importantForAutofill="yes"
                    error={errors.email}
                />

                <Input
                    label='Password'
                    value={data.password}
                    onChangeText={(val) => setData({ password: val })}
                    placeholder='Enter password'
                    secureTextEntry={!showPassword}
                    textContentType="password"
                    autoComplete="password"
                    error={errors.password}
                    rightIcon={showPassword ? "eye-off" : "eye"}
                    onRightIconPress={() => setShowPassword((p) => !p)}
                />
            </View>
        </KeyboardAwareScrollView>
    );
}

