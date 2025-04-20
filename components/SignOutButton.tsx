import React from 'react';
import { StyleSheet, Alert, Text, TouchableOpacity, Platform } from 'react-native';
import { useClerk } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

export const SignOutButton = () => {
    const { signOut } = useClerk();

    const handleSignOut = async () => {
        try {
            await signOut();
            Toast.show({
                type: 'success',
                text1: 'ログアウトしました',
                position: 'top',
                topOffset: Platform.OS === 'ios' ? 60 : 50,
                visibilityTime: 2000,
            });
            Toast.show({
                type: 'success',
                text1: 'ログアウトしました',
                position: 'top',
                topOffset: Platform.OS === 'ios' ? 60 : 50,
                visibilityTime: 2000,
            });
            // ログイン画面へ遷移
            Linking.openURL(Linking.createURL('/auth/login'));
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
            Toast.show({
                type: 'error',
                text1: 'ログアウトに失敗しました',
                text2: err instanceof Error ? err.message : undefined,
                position: 'top',
                topOffset: Platform.OS === 'ios' ? 60 : 50,
                visibilityTime: 3000,
            });
        }
    };

    const confirmLogout = () => {
        Alert.alert('ログアウト', 'ログアウトしますか？', [
            { text: 'キャンセル', style: 'cancel' },
            { text: 'ログアウト', style: 'destructive', onPress: handleSignOut },
        ]);
    };

    return (
        <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
            <Icon name="logout" size={20} color="#FFFFFF" style={styles.logoutIcon} />
            <Text style={styles.logoutText}>ログアウト</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF2500',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 24,
        marginTop: 32,
        marginBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    logoutIcon: {
        marginRight: 8,
    },
    logoutText: {
        fontFamily: 'Inter-Medium',
        fontSize: 16,
        color: '#FFFFFF',
    },
});
