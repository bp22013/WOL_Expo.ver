import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useOAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';

WebBrowser.maybeCompleteAuthSession();

export function OAuthButtons() {
    const router = useRouter();
    const { startOAuthFlow: startGoogleFlow } = useOAuth({ strategy: 'oauth_google' });
    const { startOAuthFlow: startAppleFlow } = useOAuth({ strategy: 'oauth_apple' });
    const { startOAuthFlow: startLineFlow } = useOAuth({ strategy: 'oauth_line' });

    const handleFlow = React.useCallback(
        async (
            startFlow: () => Promise<{
                createdSessionId?: string;
                setActive?: (args: { session: string }) => Promise<void>;
            }>
        ) => {
            try {
                const { createdSessionId, setActive } = await startFlow();
                if (createdSessionId && setActive) {
                    await setActive({ session: createdSessionId });
                    router.replace('/(tabs)');
                }
            } catch (err) {
                console.error('OAuth error:', err);
            }
        },
        [router]
    );

    return (
        <View style={styles.socialRow}>
            <TouchableOpacity
                style={[styles.socialBtn, styles.googleBtn]}
                onPress={() => handleFlow(startGoogleFlow)}
            >
                <AntDesign name="google" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.socialBtn, styles.appleBtn]}
                onPress={() => handleFlow(startAppleFlow)}
            >
                <AntDesign name="apple1" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.socialBtn, styles.lineBtn]}
                onPress={() => handleFlow(startLineFlow)}
            >
                <Fontisto name="line" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const SIZE = 50;

const styles = StyleSheet.create({
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    socialBtn: {
        width: SIZE,
        height: SIZE,
        borderRadius: SIZE / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    googleBtn: {
        backgroundColor: '#db4437',
    },
    appleBtn: {
        backgroundColor: '#000000',
    },
    lineBtn: {
        backgroundColor: '#00C300',
    },
});
