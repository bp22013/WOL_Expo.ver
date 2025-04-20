import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
} from 'react-native';
import { useDevices } from '@/context/DeviceContext';
import { Power } from 'lucide-react-native';
import Animated, { FadeIn, FadeInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSendRequest } from '@/hooks/useSendRequest';
import Toast from 'react-native-toast-message';

export default function ControlScreen() {
    const { devices } = useDevices();
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
    const { sendRequestToDevice, isLoading } = useSendRequest();

    const selectedDevice = devices.find((device) => device.id === selectedDeviceId);

    const handleSendRequest = async () => {
        if (!selectedDevice) {
            Toast.show({
                type: 'error',
                text1: 'デバイスが選択されていません',
                position: 'top',
                topOffset: Platform.OS === 'ios' ? 60 : 50,
                visibilityTime: 2000,
            });
            return;
        }

        const result = await sendRequestToDevice(selectedDevice);
        Toast.show({
            type: result.success ? 'success' : 'error',
            text1: result.success ? '起動シグナルを送信しました' : '送信に失敗しました',
            text2: result.error ?? undefined,
            position: 'top',
            topOffset: Platform.OS === 'ios' ? 60 : 50,
            visibilityTime: 2000,
        });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
                <Text style={styles.title}>コントロール</Text>
            </Animated.View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>デバイスを選択</Text>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.devicesList}
                >
                    {devices.length === 0 ? (
                        <Text style={styles.noDevicesText}>デバイスが登録されていません</Text>
                    ) : (
                        devices.map((device, index) => (
                            <Animated.View
                                key={device.id}
                                entering={FadeInRight.delay(index * 100).duration(400)}
                            >
                                <TouchableOpacity
                                    style={[
                                        styles.deviceCard,
                                        selectedDeviceId === device.id && styles.selectedDeviceCard,
                                    ]}
                                    onPress={() => setSelectedDeviceId(device.id)}
                                >
                                    <Text
                                        style={[
                                            styles.deviceName,
                                            selectedDeviceId === device.id &&
                                                styles.selectedDeviceName,
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {device.name}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.deviceIp,
                                            selectedDeviceId === device.id &&
                                                styles.selectedDeviceIp,
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {device.ipAddress}
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>
                        ))
                    )}
                </ScrollView>

                <View style={styles.controlSection}>
                    <Text style={styles.sectionTitle}>デバイス情報</Text>

                    {selectedDevice ? (
                        <View style={styles.commandContainer}>
                            <View style={styles.deviceInfoContainer}>
                                <Text style={styles.deviceInfoLabel}>デバイス名:</Text>
                                <Text style={styles.deviceInfoValue}>{selectedDevice.name}</Text>
                            </View>

                            <View style={styles.deviceInfoContainer}>
                                <Text style={styles.deviceInfoLabel}>IP アドレス:</Text>
                                <Text style={styles.deviceInfoValue}>
                                    {selectedDevice.ipAddress}
                                </Text>
                            </View>

                            <View style={styles.deviceInfoContainer}>
                                <Text style={styles.deviceInfoLabel}>ポート番号:</Text>
                                <Text style={styles.deviceInfoValue}>{selectedDevice.port}</Text>
                            </View>

                            <TouchableOpacity
                                style={styles.sendButton}
                                onPress={handleSendRequest}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <>
                                        <Power size={20} color="#fff" style={styles.sendIcon} />
                                        <Text style={styles.sendButtonText}>
                                            起動シグナルを送信
                                        </Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.selectDevicePrompt}>
                            <Text style={styles.selectDeviceText}>デバイスを選択してください</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F8FA',
    },
    header: {
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    title: {
        fontFamily: 'Inter-Bold',
        fontSize: 28,
        color: '#16253B',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 18,
        color: '#16253B',
        marginTop: 16,
        marginBottom: 12,
    },
    devicesList: {
        paddingBottom: 8,
        paddingRight: 16,
    },
    deviceCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginRight: 12,
        width: 160,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    selectedDeviceCard: {
        backgroundColor: '#0068D9',
    },
    deviceName: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: '#16253B',
        marginBottom: 4,
    },
    selectedDeviceName: {
        color: '#fff',
    },
    deviceIp: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: '#8E9AAF',
    },
    selectedDeviceIp: {
        color: '#E1EFFF',
    },
    noDevicesText: {
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        color: '#8E9AAF',
        padding: 16,
    },
    controlSection: {
        marginTop: 24,
        marginBottom: 24,
    },
    commandContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    deviceInfoContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    deviceInfoLabel: {
        fontFamily: 'Inter-Medium',
        fontSize: 16,
        color: '#666',
        width: 100,
    },
    deviceInfoValue: {
        flex: 1,
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: '#16253B',
    },
    sendButton: {
        flexDirection: 'row',
        backgroundColor: '#0068D9',
        borderRadius: 12,
        paddingVertical: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    sendIcon: {
        marginRight: 8,
    },
    sendButtonText: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: '#fff',
    },
    selectDevicePrompt: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    selectDeviceText: {
        fontFamily: 'Inter-Medium',
        fontSize: 16,
        color: '#8E9AAF',
        textAlign: 'center',
    },
    resultContainer: {
        marginTop: 16,
        padding: 16,
        borderRadius: 12,
    },
    successResult: {
        backgroundColor: '#E7F5ED',
    },
    errorResult: {
        backgroundColor: '#FBECEC',
    },
    resultText: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#16253B',
    },
});
