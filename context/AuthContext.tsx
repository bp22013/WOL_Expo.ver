import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User } from '@/types/user';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = await SecureStore.getItemAsync('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Failed to load user:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            // In a real app, this would be an API call to your authentication server
            // For demo purposes, we'll simulate a successful login

            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Create mock user (in real app, this would come from your API)
            const newUser: User = {
                id: '1',
                name: email.split('@')[0],
                email: email,
            };

            // Store user in secure storage
            await SecureStore.setItemAsync('user', JSON.stringify(newUser));

            // Update state
            setUser(newUser);
        } catch (error) {
            console.error('Login failed:', error);
            throw new Error('Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string) => {
        setIsLoading(true);
        try {
            // In a real app, this would be an API call to create a new user
            // For demo purposes, we'll simulate a successful registration

            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Create mock user (in real app, this would come from your API)
            const newUser: User = {
                id: Date.now().toString(),
                name: name,
                email: email,
            };

            // Store user in secure storage
            await SecureStore.setItemAsync('user', JSON.stringify(newUser));

            // Update state
            setUser(newUser);
        } catch (error) {
            console.error('Registration failed:', error);
            throw new Error('Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            // Clear stored user data
            await SecureStore.deleteItemAsync('user');
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
