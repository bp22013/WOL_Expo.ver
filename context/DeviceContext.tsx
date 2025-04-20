import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Device, NewDevice } from '@/types/device';
import { generateId } from '@/utils/helpers';
import { useUser } from '@clerk/clerk-expo';

interface DeviceContextType {
    devices: Device[];
    isLoading: boolean;
    loadDevices: () => Promise<void>;
    addDevice: (device: NewDevice) => Promise<void>;
    updateDevice: (device: Device) => Promise<void>;
    deleteDevice: (id: string) => Promise<void>;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

interface DeviceProviderProps {
    children: ReactNode;
}

export function DeviceProvider({ children }: DeviceProviderProps) {
    const [devices, setDevices] = useState<Device[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useUser();

    useEffect(() => {
        if (user) {
            loadDevices();
        } else {
            setDevices([]);
        }
    }, [user]);

    const loadDevices = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            const storageKey = `devices_${user.id}`;
            const storedDevices = await AsyncStorage.getItem(storageKey);

            if (storedDevices) {
                setDevices(JSON.parse(storedDevices));
            } else {
                setDevices([]);
            }
        } catch (error) {
            console.error('Failed to load devices:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveDevices = async (updatedDevices: Device[]) => {
        if (!user) return;

        try {
            const storageKey = `devices_${user.id}`;
            await AsyncStorage.setItem(storageKey, JSON.stringify(updatedDevices));
            setDevices(updatedDevices);
        } catch (error) {
            console.error('Failed to save devices:', error);
            throw new Error('Failed to save devices');
        }
    };

    const addDevice = async (newDevice: NewDevice) => {
        setIsLoading(true);
        try {
            const device: Device = {
                ...newDevice,
                id: generateId(),
            };

            const updatedDevices = [...devices, device];
            await saveDevices(updatedDevices);
        } catch (error) {
            console.error('Failed to add device:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const updateDevice = async (updatedDevice: Device) => {
        setIsLoading(true);
        try {
            const updatedDevices = devices.map((device) =>
                device.id === updatedDevice.id ? updatedDevice : device
            );
            await saveDevices(updatedDevices);
        } catch (error) {
            console.error('Failed to update device:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteDevice = async (id: string) => {
        setIsLoading(true);
        try {
            const updatedDevices = devices.filter((device) => device.id !== id);
            await saveDevices(updatedDevices);
        } catch (error) {
            console.error('Failed to delete device:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DeviceContext.Provider
            value={{
                devices,
                isLoading,
                loadDevices,
                addDevice,
                updateDevice,
                deleteDevice,
            }}
        >
            {children}
        </DeviceContext.Provider>
    );
}

export function useDevices() {
    const context = useContext(DeviceContext);
    if (context === undefined) {
        throw new Error('useDevices must be used within a DeviceProvider');
    }
    return context;
}
