import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Edit2 as Edit, Power } from 'lucide-react-native';
import { Device } from '@/types/device';
import { useSendRequest } from '@/hooks/useSendRequest';
import Toast from 'react-native-toast-message';

interface DeviceCardProps {
    device: Device;
}

export default function DeviceCard({ device }: DeviceCardProps) {
    const router = useRouter();
    const { sendRequestToDevice, isLoading } = useSendRequest();

    const handleEditDevice = () => {
        router.push({
            pathname: '/device/edit',
            params: { id: device.id },
        });
    };

    const handleWakeDevice = async () => {
        const result = await sendRequestToDevice(device);
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
        <View style={styles.card}>
            <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>{device.name}</Text>
                <Text style={styles.deviceIp}>
                    {device.ipAddress}:{device.port}
                </Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton} onPress={handleEditDevice}>
                    <Edit size={20} color="#0068D9" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.wakeButton, isLoading && styles.loadingButton]}
                    onPress={handleWakeDevice}
                    disabled={isLoading}
                >
                    <Power size={18} color="#fff" style={styles.wakeButtonIcon} />
                    <Text style={styles.wakeButtonText}>{isLoading ? '送信中...' : '起動'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    deviceInfo: {
        flex: 1,
    },
    deviceName: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 18,
        color: '#16253B',
        marginBottom: 4,
    },
    deviceIp: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: '#8E9AAF',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        padding: 8,
        marginRight: 8,
    },
    wakeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0068D9',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    loadingButton: {
        backgroundColor: '#A2C4EA',
    },
    wakeButtonIcon: {
        marginRight: 4,
    },
    wakeButtonText: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#fff',
    },
});
