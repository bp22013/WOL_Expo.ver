import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { CircleCheck as CheckCircle2, Circle as XCircle } from 'lucide-react-native';
import { HistoryItem as HistoryItemType } from '@/types/history';

interface HistoryItemProps {
    item: HistoryItemType;
}

export default function HistoryItem({ item }: HistoryItemProps) {
    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.statusIndicator,
                    item.success ? styles.successIndicator : styles.errorIndicator,
                ]}
            >
                {item.success ? (
                    <CheckCircle2 size={20} color="#2E7D32" />
                ) : (
                    <XCircle size={20} color="#D32F2F" />
                )}
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.row}>
                    <Text style={styles.deviceName}>{item.deviceName}</Text>
                    <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
                </View>

                <Text style={styles.deviceAddress}>
                    {item.ipAddress}:{item.port}
                </Text>

                <View
                    style={[
                        styles.statusContainer,
                        item.success ? styles.successContainer : styles.errorContainer,
                    ]}
                >
                    <Text
                        style={[
                            styles.statusText,
                            item.success ? styles.successText : styles.errorText,
                        ]}
                    >
                        {item.message}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
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
    statusIndicator: {
        marginRight: 16,
        paddingTop: 2,
    },
    successIndicator: {
        color: '#2E7D32',
    },
    errorIndicator: {
        color: '#D32F2F',
    },
    contentContainer: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    deviceName: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: '#16253B',
    },
    timestamp: {
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        color: '#8E9AAF',
    },
    deviceAddress: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: '#8E9AAF',
        marginBottom: 8,
    },
    statusContainer: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginTop: 4,
    },
    successContainer: {
        backgroundColor: '#E7F5ED',
    },
    errorContainer: {
        backgroundColor: '#FBECEC',
    },
    statusText: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
    },
    successText: {
        color: '#2E7D32',
    },
    errorText: {
        color: '#D32F2F',
    },
});
