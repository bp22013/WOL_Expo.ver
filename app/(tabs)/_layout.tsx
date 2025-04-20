import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Chrome as Home, History, Settings, Power } from 'lucide-react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#0068D9',
                tabBarInactiveTintColor: '#8E9AAF',
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarStyle: styles.tabBar,
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'デバイス',
                    tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="control"
                options={{
                    title: 'コントロール',
                    tabBarIcon: ({ color, size }) => <Power size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: '履歴',
                    tabBarIcon: ({ color, size }) => <History size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: '設定',
                    tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        height: 90,
        paddingTop: 8,
        paddingBottom: 20,
        borderTopColor: '#E1E1E1',
    },
    tabBarLabel: {
        fontFamily: 'Inter-Medium',
        fontSize: 12,
        paddingBottom: 20,
        marginTop: 5,
    },
});
