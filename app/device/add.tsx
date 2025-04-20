import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDevices } from '@/context/DeviceContext';
import { Monitor, Globe, Hash } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function AddDeviceScreen() {
    const [name, setName] = useState('');
    const [ipAddress, setIpAddress] = useState('');
    const [port, setPort] = useState('8080');
    const [error, setError] = useState<string | null>(null);
    const { addDevice, isLoading } = useDevices();
    const router = useRouter();

    const validateIpAddress = (input: string) => {
        // IPv4 の厳密チェック
        const ipRegex = /^(25[0-5]|2[0-4]\d|[01]?\d?\d)(\.(25[0-5]|2[0-4]\d|[01]?\d?\d)){3}$/;

        // ドメイン名チェック（ラベルは 1〜63 文字、ハイフン許可、末尾は英字2文字以上）
        const domainRegex =
            /^(?=.{1,253}$)(?!-)[A-Za-z0-9-]{1,63}(?<!-)(?:\.(?!-)[A-Za-z0-9-]{1,63}(?<!-))*\.[A-Za-z]{2,}$/;

        return ipRegex.test(input) || domainRegex.test(input);
    };

    const validatePort = (port: string) => {
        // Port should be a number between 1 and 65535
        const portNum = parseInt(port, 10);
        return !isNaN(portNum) && portNum >= 1 && portNum <= 65535;
    };

    const handleAddDevice = async () => {
        // Validate inputs
        if (!name.trim()) {
            setError('デバイス名を入力してください');
            return;
        }

        if (!validateIpAddress(ipAddress)) {
            setError('有効なIPアドレスまたはドメイン名を入力してください');
            return;
        }

        if (!port.trim() || !validatePort(port)) {
            setError('有効なポート番号を入力してください (1-65535)');
            return;
        }

        setError(null);
        try {
            await addDevice({
                name: name.trim(),
                ipAddress: ipAddress.trim(),
                port: parseInt(port, 10),
            });
            router.back();
        } catch (err) {
            setError('デバイスを追加できませんでした。 再度お試しください');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <ScrollView style={styles.scrollView}>
                <Animated.View entering={FadeIn.duration(400)} style={styles.formContainer}>
                    <Text style={styles.label}>デバイス名</Text>
                    <View style={styles.inputContainer}>
                        <Monitor size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="デバイス名を入力してください"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <Text style={styles.label}>IP アドレス / ドメイン名</Text>
                    <View style={styles.inputContainer}>
                        <Globe size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="IPアドレスまたはドメイン名を入力してください"
                            value={ipAddress}
                            onChangeText={setIpAddress}
                        />
                    </View>

                    <Text style={styles.label}>ポート番号</Text>
                    <View style={styles.inputContainer}>
                        <Hash size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="ポート番号を入力してください"
                            value={port}
                            onChangeText={setPort}
                            keyboardType="numeric"
                        />
                    </View>

                    {error && <Text style={styles.errorText}>{error}</Text>}

                    <TouchableOpacity
                        style={[
                            styles.addButton,
                            (!name || !ipAddress || !port) && styles.disabledButton,
                        ]}
                        onPress={handleAddDevice}
                        disabled={isLoading || !name || !ipAddress || !port}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.addButtonText}>追加</Text>
                        )}
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F8FA',
    },
    scrollView: {
        flex: 1,
    },
    formContainer: {
        padding: 24,
    },
    label: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: '#16253B',
        marginBottom: 8,
        marginTop: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E1E1E1',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
        backgroundColor: '#FFFFFF',
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
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: '#E53935',
        marginTop: 16,
    },
    addButton: {
        backgroundColor: '#0068D9',
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 32,
    },
    disabledButton: {
        backgroundColor: '#A2C4EA',
    },
    addButtonText: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 18,
        color: '#fff',
    },
});
