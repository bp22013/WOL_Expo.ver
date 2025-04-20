import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import {
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
} from '@expo-google-fonts/inter';

// Prevent auto-hiding the splash screen
SplashScreen.preventAutoHideAsync();

export default function Index() {
    const { isSignedIn, isLoaded } = useUser();

    const [fontsLoaded, fontError] = useFonts({
        'Inter-Regular': Inter_400Regular,
        'Inter-Medium': Inter_500Medium,
        'Inter-SemiBold': Inter_600SemiBold,
        'Inter-Bold': Inter_700Bold,
    });

    // Hide splash screen once fonts are loaded
    useEffect(() => {
        if (fontsLoaded || fontError) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    // Return null to keep splash screen visible while fonts load
    if (!fontsLoaded && !fontError) {
        return null;
    }

    if (!isLoaded) {
        return null;
    }

    return <Redirect href={isSignedIn ? '/(tabs)' : '/auth/login'} />;
}
