import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@clerk/clerk-expo';
import { useSettings } from '@/hooks/useSettings';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SignOutButton } from '@/components/SignOutButton';
import { ChevronRight, Shield, Bell, CircleHelp as HelpCircle, Info } from 'lucide-react-native';

export default function SettingsScreen() {
    const { user } = useUser();
    const { settings, updateSetting } = useSettings();

    const toggleNotifications = () => {
        updateSetting('notifications', !settings.notifications);
    };

    const toggleAutoConnect = () => {
        updateSetting('autoConnect', !settings.autoConnect);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
                <Text style={styles.title}>設定</Text>
            </Animated.View>

            <ScrollView style={styles.content}>
                <View style={styles.profileSection}>
                    <View style={styles.profileInfo}>
                        <View style={styles.profileAvatar}>
                            {user?.imageUrl ? (
                                <Image source={{ uri: user.imageUrl }} style={styles.avatarImage} />
                            ) : (
                                <Text style={styles.profileInitial}>
                                    {user?.firstName?.[0] || user?.lastName?.[0] || 'U'}
                                </Text>
                            )}
                        </View>
                        <View>
                            <Text style={styles.profileName}>
                                {user?.lastName && user?.firstName
                                    ? `${user.lastName} ${user.firstName}`
                                    : 'User'}
                            </Text>
                            <Text style={styles.profileEmail}>
                                {user?.primaryEmailAddress?.emailAddress || 'user@example.com'}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>オプション</Text>

                    <View style={styles.settingItem}>
                        <Bell size={20} color="#666" style={styles.settingIcon} />
                        <Text style={styles.settingLabel}>お知らせ</Text>
                        <Switch
                            value={settings.notifications}
                            onValueChange={toggleNotifications}
                            trackColor={{ false: '#D1D1D6', true: '#0068D9' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <Shield size={20} color="#666" style={styles.settingIcon} />
                        <Text style={styles.settingLabel}>自動接続</Text>
                        <Switch
                            value={settings.autoConnect}
                            onValueChange={toggleAutoConnect}
                            trackColor={{ false: '#D1D1D6', true: '#0068D9' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>サポート</Text>

                    <TouchableOpacity style={styles.menuItem}>
                        <HelpCircle size={20} color="#666" style={styles.menuIcon} />
                        <Text style={styles.menuLabel}>Help Center</Text>
                        <ChevronRight size={20} color="#8E9AAF" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Info size={20} color="#666" style={styles.menuIcon} />
                        <Text style={styles.menuLabel}>About</Text>
                        <ChevronRight size={20} color="#8E9AAF" />
                    </TouchableOpacity>
                </View>
                <SignOutButton />
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
        fontSize: 31,
        color: '#16253B',
    },
    content: {
        flex: 1,
    },
    profileSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginHorizontal: 24,
        marginTop: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#0068D9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        overflow: 'hidden', // これを追加して画像がはみ出ないようにする
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    profileInitial: {
        fontFamily: 'Inter-Bold',
        fontSize: 24,
        color: '#FFFFFF',
    },
    profileName: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 18,
        color: '#16253B',
        marginBottom: 4,
    },
    profileEmail: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: '#8E9AAF',
    },
    section: {
        marginTop: 24,
        marginHorizontal: 24,
    },
    sectionTitle: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 18,
        color: '#16253B',
        marginBottom: 16,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    settingIcon: {
        marginRight: 16,
    },
    settingLabel: {
        flex: 1,
        fontFamily: 'Inter-Medium',
        fontSize: 16,
        color: '#16253B',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    menuIcon: {
        marginRight: 16,
    },
    menuLabel: {
        flex: 1,
        fontFamily: 'Inter-Medium',
        fontSize: 16,
        color: '#16253B',
    },
});
