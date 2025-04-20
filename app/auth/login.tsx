import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    Text,
    TouchableOpacity,
    Keyboard,
    TouchableWithoutFeedback,
    ActivityIndicator,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSignIn } from '@clerk/clerk-expo';
import Animated, { FadeIn } from 'react-native-reanimated';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { OAuthButtons } from '@/components/OAuthButtons';
import Toast from 'react-native-toast-message';

export default function Login() {
    const { signIn, setActive, isLoaded } = useSignIn();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    const onSignedInPress = async () => {
        if (!isLoaded) return;
        setError(null);
        setLoading(true);

        try {
            const attempt = await signIn.create({
                identifier: email.trim(),
                password: pass,
            });

            if (attempt.status === 'complete' && attempt.createdSessionId) {
                await setActive({ session: attempt.createdSessionId });
                Toast.show({
                    type: 'success',
                    text1: 'ログインに成功しました',
                    position: 'top',
                    topOffset: Platform.OS === 'ios' ? 60 : 50,
                    visibilityTime: 2000,
                });
                router.replace('/');
            } else {
                const msg = '認証に失敗しました。';
                setError(msg);
                Toast.show({
                    type: 'error',
                    text1: msg,
                    position: 'top',
                    topOffset: Platform.OS === 'ios' ? 60 : 50,
                    visibilityTime: 2000,
                });
            }
        } catch (err) {
            console.error(err);
            const msg = 'ログイン中にエラーが発生しました';
            setError(msg);
            Toast.show({
                type: 'error',
                text1: msg,
                position: 'top',
                topOffset: Platform.OS === 'ios' ? 60 : 50,
                visibilityTime: 2000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.container}>
                <Animated.View entering={FadeIn.duration(600)} style={styles.headerContainer}>
                    <Text style={styles.title}>ログイン</Text>
                </Animated.View>

                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <AntDesign name="mail" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="メールアドレスを入力"
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <AntDesign name="lock" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="パスワードを入力"
                            placeholderTextColor="#999"
                            secureTextEntry
                            value={pass}
                            onChangeText={setPass}
                        />
                    </View>

                    {error && <Text style={styles.errorText}>{error}</Text>}

                    <TouchableOpacity
                        style={[
                            styles.loginButton,
                            (!email || !pass || loading) && styles.disabledButton,
                        ]}
                        onPress={onSignedInPress}
                        disabled={!email || !pass || loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.loginButtonText}>ログイン</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.socialBtnText}>
                    <Text>または以下でログイン</Text>
                </View>
                <OAuthButtons />

                <View style={styles.footer}>
                    <Text style={styles.footerText}>アカウントをお持ちでないですか？</Text>
                </View>
                <View style={styles.secFooter}>
                    <TouchableOpacity onPress={() => router.push('/auth/register')}>
                        <Text style={styles.footerLink}>新規登録はこちら</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const SIZE = 50;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'ios' ? 80 : 60,
        paddingHorizontal: 24,
        marginTop: 10,
    },
    headerContainer: {
        marginBottom: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontFamily: 'Inter-Bold',
        fontSize: 32,
        color: '#16253B',
        marginBottom: 4,
        textAlign: 'center',
    },
    formContainer: {
        marginTop: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F5',
        borderRadius: 25,
        marginVertical: 8,
        paddingHorizontal: 16,
        height: 50,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        color: '#333',
    },
    errorText: {
        color: '#E53935',
        textAlign: 'center',
        marginTop: 8,
    },
    loginButton: {
        backgroundColor: '#8CB4F3',
        borderRadius: 25,
        height: 50,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    disabledButton: {
        backgroundColor: '#BDDDFE',
    },
    loginButtonText: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 18,
        color: '#fff',
    },
    socialBtnText: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
        marginBottom: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
    },
    footerText: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: '#666',
    },
    secFooter: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 15,
    },
    footerLink: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 14,
        color: '#0068D9',
        marginLeft: 6,
    },
});
