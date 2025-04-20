import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Keyboard,
    TouchableWithoutFeedback,
    Platform,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useSignUp } from '@clerk/clerk-expo';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ArrowRight } from 'lucide-react-native';

export default function Register() {
    const router = useRouter();
    const { isLoaded, signUp, setActive } = useSignUp();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [pendingVerification, setPendingVerification] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const dismissKeyboard = () => Keyboard.dismiss();

    const onSignUpPress = async () => {
        if (!isLoaded) return;
        setError(null);
        setLoading(true);
        try {
            const result = await signUp.create({
                emailAddress: email.trim(),
                password,
            });
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            setPendingVerification(true);
        } catch (e: any) {
            console.error(e);
            setError(e.errors?.[0]?.longMessage || '登録に失敗しました');
        } finally {
            setLoading(false);
        }
    };

    const onVerifyPress = async () => {
        if (!isLoaded) return;
        setError(null);
        setLoading(true);
        try {
            const attempt = await signUp.attemptEmailAddressVerification({ code });
            if (attempt.status === 'complete' && attempt.createdSessionId) {
                await setActive({ session: attempt.createdSessionId });
                router.replace('/');
            } else {
                setError('認証に失敗しました');
            }
        } catch (e) {
            console.error(e);
            setError('認証中にエラーが発生しました');
        } finally {
            setLoading(false);
        }
    };

    if (pendingVerification) {
        return (
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <View style={styles.container}>
                    <Text style={styles.title}>確認コードを入力</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="確認コード"
                            placeholderTextColor="#999"
                            value={code}
                            onChangeText={setCode}
                        />
                    </View>
                    {error && <Text style={styles.errorText}>{error}</Text>}
                    <TouchableOpacity
                        style={[styles.actionButton, loading && styles.disabledButton]}
                        onPress={onVerifyPress}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.actionText}>認証する</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.container}>
                <Animated.View entering={FadeIn.duration(600)} style={styles.headerContainer}>
                    <Text style={styles.title}>アカウント新規作成</Text>
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
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <AntDesign name="lock" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="パスワードを入力"
                            placeholderTextColor="#999"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    {error && (
                        <Animated.Text
                            entering={FadeIn.duration(300)}
                            exiting={FadeOut.duration(300)}
                            style={styles.errorText}
                        >
                            {error}
                        </Animated.Text>
                    )}

                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            (!email || !password || loading) && styles.disabledButton,
                        ]}
                        onPress={onSignUpPress}
                        disabled={!email || !password || loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Text style={styles.actionText}>新規登録</Text>
                                <ArrowRight size={20} color="#fff" style={styles.actionIcon} />
                            </>
                        )}
                    </TouchableOpacity>
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>アカウントを既にお持ちですか？</Text>
                    </View>
                    <View style={styles.loginContainer}>
                        <TouchableOpacity onPress={() => router.push('/auth/login')}>
                            <Text style={styles.loginText}>ログインはこちら</Text>
                        </TouchableOpacity>
                        <Link href="/auth/login" asChild></Link>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'ios' ? 92 : 60,
        paddingHorizontal: 24,
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
    },
    subtitle: {
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
    },
    formContainer: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F5',
        marginTop: 20,
        borderRadius: 25,
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
        marginVertical: 12,
    },
    actionButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#8CB4F3',
        borderRadius: 25,
        height: 50,
        marginTop: 40,
    },
    disabledButton: {
        backgroundColor: '#BDDDFE',
    },
    actionText: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 18,
        color: '#fff',
        marginRight: 8,
    },
    actionIcon: {
        marginLeft: 4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
    },
    footerText: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        marginTop: 20,
        color: '#666',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 18,
    },
    loginText: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 14,
        color: '#0068D9',
        marginLeft: 6,
    },
    loginLink: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 14,
        color: '#0068D9',
    },
});
