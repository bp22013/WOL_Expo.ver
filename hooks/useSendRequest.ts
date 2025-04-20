import { useState } from 'react';
import { Device } from '@/types/device';
import { sendRequest } from '@/services/apiService';
import { useHistory } from '@/context/HistoryContext';

interface RequestResult {
    success: boolean;
    message: string;
}

export function useSendRequest() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<RequestResult | null>(null);
    const { addHistoryItem } = useHistory();

    const sendRequestToDevice = async (device: Device) => {
        setIsLoading(true);
        setResult(null);

        try {
            const response = await sendRequest(device);

            const resultItem = {
                success: response.success,
                message: response.success
                    ? 'Request sent successfully'
                    : response.error || 'Request failed',
            };

            setResult(resultItem);

            // Add to history
            await addHistoryItem({
                deviceName: device.name,
                ipAddress: device.ipAddress,
                port: device.port,
                timestamp: Date.now(),
                success: response.success,
                message: resultItem.message,
            });

            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

            const resultItem = {
                success: false,
                message: errorMessage,
            };

            setResult(resultItem);

            // Add to history
            await addHistoryItem({
                deviceName: device.name,
                ipAddress: device.ipAddress,
                port: device.port,
                timestamp: Date.now(),
                success: false,
                message: errorMessage,
            });

            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        sendRequestToDevice,
        isLoading,
        result,
    };
}
