import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HistoryItem } from '@/types/history';
import { useUser } from '@clerk/clerk-expo';

interface HistoryContextType {
    history: HistoryItem[];
    isLoading: boolean;
    loadHistory: () => Promise<void>;
    addHistoryItem: (item: Omit<HistoryItem, 'id'>) => Promise<void>;
    clearHistory: () => Promise<void>;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

interface HistoryProviderProps {
    children: ReactNode;
}

export function HistoryProvider({ children }: HistoryProviderProps) {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useUser();

    useEffect(() => {
        if (user) {
            loadHistory();
        } else {
            setHistory([]);
        }
    }, [user]);

    const loadHistory = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            const storageKey = `history_${user.id}`;
            const storedHistory = await AsyncStorage.getItem(storageKey);

            if (storedHistory) {
                setHistory(JSON.parse(storedHistory));
            } else {
                setHistory([]);
            }
        } catch (error) {
            console.error('履歴を読み込めませんでした:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveHistory = async (updatedHistory: HistoryItem[]) => {
        if (!user) return;

        try {
            const storageKey = `history_${user.id}`;
            await AsyncStorage.setItem(storageKey, JSON.stringify(updatedHistory));
            setHistory(updatedHistory);
        } catch (error) {
            console.error('履歴を保存できませんでした:', error);
            throw new Error('履歴を保存できませんでした');
        }
    };

    const addHistoryItem = async (item: Omit<HistoryItem, 'id'>) => {
        try {
            const newItem: HistoryItem = {
                ...item,
                id: Date.now().toString(),
            };

            const updatedHistory = [newItem, ...history].slice(0, 10000); // Keep last 100 items
            await saveHistory(updatedHistory);
        } catch (error) {
            console.error('履歴情報を追加できませんでした:', error);
            throw error;
        }
    };

    const clearHistory = async () => {
        try {
            await saveHistory([]);
        } catch (error) {
            console.error('履歴を削除できませんでした:', error);
            throw error;
        }
    };

    return (
        <HistoryContext.Provider
            value={{
                history,
                isLoading,
                loadHistory,
                addHistoryItem,
                clearHistory,
            }}
        >
            {children}
        </HistoryContext.Provider>
    );
}

export function useHistory() {
    const context = useContext(HistoryContext);
    if (context === undefined) {
        throw new Error('useHistory must be used within a HistoryProvider');
    }
    return context;
}
