import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHistory } from '@/context/HistoryContext';
import HistoryItem from '@/components/HistoryItem';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Trash2 } from 'lucide-react-native';

export default function HistoryScreen() {
    const { history, isLoading, loadHistory, clearHistory } = useHistory();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadHistory();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadHistory();
        setRefreshing(false);
    };

    const handleClearHistory = async () => {
        await clearHistory();
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
                <Text style={styles.title}>送信履歴</Text>
                {history.length > 0 && (
                    <TouchableOpacity style={styles.clearButton} onPress={handleClearHistory}>
                        <Trash2 size={20} color="#E53935" />
                    </TouchableOpacity>
                )}
            </Animated.View>

            {history.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>送信履歴がありません</Text>
                    <Text style={styles.emptySubtext}>送信履歴がここに表示されます</Text>
                </View>
            ) : (
                <FlatList
                    data={history}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <Animated.View entering={FadeInDown.delay(index * 100).duration(400)}>
                            <HistoryItem item={item} />
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
    clearButton: {
        padding: 8,
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
        marginBottom: 8,
    },
    emptySubtext: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: '#8E9AAF',
        textAlign: 'center',
        marginTop: 10,
    },
});
