import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '@clerk/clerk-expo';

interface Settings {
    notifications: boolean;
    autoConnect: boolean;
    // Add more settings as needed
}

const DEFAULT_SETTINGS: Settings = {
    notifications: true,
    autoConnect: false,
};

export function useSettings() {
    const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useUser();

    useEffect(() => {
        if (user) {
            loadSettings();
        } else {
            setSettings(DEFAULT_SETTINGS);
        }
    }, [user]);

    const loadSettings = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            const storageKey = `settings_${user.id}`;
            const storedSettings = await AsyncStorage.getItem(storageKey);

            if (storedSettings) {
                setSettings(JSON.parse(storedSettings));
            } else {
                setSettings(DEFAULT_SETTINGS);
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
            setSettings(DEFAULT_SETTINGS);
        } finally {
            setIsLoading(false);
        }
    };

    const saveSettings = async (updatedSettings: Settings) => {
        if (!user) return;

        try {
            const storageKey = `settings_${user.id}`;
            await AsyncStorage.setItem(storageKey, JSON.stringify(updatedSettings));
            setSettings(updatedSettings);
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    };

    const updateSetting = async <K extends keyof Settings>(key: K, value: Settings[K]) => {
        const updatedSettings = { ...settings, [key]: value };
        await saveSettings(updatedSettings);
    };

    return {
        settings,
        isLoading,
        updateSetting,
    };
}
