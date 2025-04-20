import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

export default function DeviceLayout() {
    const router = useRouter();

    const renderBackButton = () => (
        <View style={{ paddingHorizontal: 8, marginTop: 30 }}>
            <TouchableOpacity onPress={() => router.back()}>
                <ArrowLeft size={24} color="#16253B" />
            </TouchableOpacity>
        </View>
    );

    return (
        <Stack>
            <Stack.Screen
                name="add"
                options={{
                    title: 'デバイスを追加',
                    headerShown: true,
                    headerTitleStyle: {
                        fontFamily: 'Inter-SemiBold',
                        fontSize: 18,
                    },
                    headerTintColor: '#16253B',
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: '#F6F8FA',
                    },
                    headerLeft: renderBackButton,
                }}
            />
            <Stack.Screen
                name="edit"
                options={{
                    title: 'デバイス情報を編集',
                    headerShown: true,
                    headerTitleStyle: {
                        fontFamily: 'Inter-SemiBold',
                        fontSize: 18,
                    },
                    headerTintColor: '#16253B',
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: '#F6F8FA',
                    },
                    headerLeft: renderBackButton,
                }}
            />
        </Stack>
    );
}
