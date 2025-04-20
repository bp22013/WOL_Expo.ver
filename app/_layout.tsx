// layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { DeviceProvider } from '@/context/DeviceContext';
import { HistoryProvider } from '@/context/HistoryContext';
import { ClerkProvider } from '@clerk/clerk-expo';
import { jaJP } from '@clerk/localizations';
import Toast from 'react-native-toast-message'; // ← 追加

export default function RootLayout() {
    useFrameworkReady();

    return (
        <ClerkProvider
            tokenCache={tokenCache}
            publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
            localization={jaJP}
        >
            <DeviceProvider>
                <HistoryProvider>
                    {/* ルートナビゲーターはこのStackだけにする */}
                    <Stack
                        screenOptions={{
                            headerShown: false,
                            animation: 'fade',
                        }}
                    >
                        {/* 各画面をここに列挙 */}
                        <Stack.Screen name="(tabs)" />
                        <Stack.Screen name="auth" />
                        <Stack.Screen name="device" />
                        <Stack.Screen name="+not-found" />
                    </Stack>

                    <StatusBar style="auto" />

                    {/* トースト表示用コンポーネントを最上位に配置 */}
                    <Toast />
                </HistoryProvider>
            </DeviceProvider>
        </ClerkProvider>
    );
}
