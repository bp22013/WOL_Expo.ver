import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDevices } from '@/context/DeviceContext';
import DeviceCard from '@/components/DeviceCard';
import { Plus } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DevicesScreen() {
    const { devices, isLoading, loadDevices } = useDevices();
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadDevices();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadDevices();
        setRefreshing(false);
    };

    const navigateToAddDevice = () => {
        router.push('/device/add');
    };

    if (isLoading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0068D9" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
                <Text style={styles.title}>デバイス一覧</Text>
                <TouchableOpacity style={styles.addButton} onPress={navigateToAddDevice}>
                    <Plus size={24} color="#fff" />
                </TouchableOpacity>
            </Animated.View>

            {devices.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>デバイスが登録されていません</Text>
                    <TouchableOpacity style={styles.emptyButton} onPress={navigateToAddDevice}>
                        <Text style={styles.emptyButtonText}>デバイスを登録</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={devices}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <Animated.View entering={FadeInDown.delay(index * 100).duration(400)}>
                            <DeviceCard device={item} />
                        </Animated.View>
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F8FA',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F6F8FA',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    title: {
        fontFamily: 'Inter-Bold',
        fontSize: 28,
        color: '#16253B',
    },
    addButton: {
        backgroundColor: '#0068D9',
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    listContent: {
        padding: 16,
        paddingBottom: 24,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    emptyText: {
        fontFamily: 'Inter-Medium',
        fontSize: 18,
        color: '#8E9AAF',
        marginBottom: 16,
    },
    emptyButton: {
        backgroundColor: '#0068D9',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    emptyButtonText: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: '#fff',
    },
});
