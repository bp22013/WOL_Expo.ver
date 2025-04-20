import { Device } from '@/types/device';
import { Platform } from 'react-native';

interface RequestResponse {
    success: boolean;
    error?: string;
}

export async function sendRequest(device: Device): Promise<RequestResponse> {
    const url = `http://${device.ipAddress}:${device.port}/wake`;

    // 5秒で中断するコントローラを用意
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
        // 実際に POST リクエストを送信
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                command: 'wake',
                timestamp: Date.now(),
            }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            return {
                success: false,
                error: `Request failed with status ${response.status}`,
            };
        }
        return { success: true };
    } catch (err) {
        clearTimeout(timeoutId);
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Network error',
        };
    }
}
