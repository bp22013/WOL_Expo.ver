export interface HistoryItem {
    id: string;
    deviceName: string;
    ipAddress: string;
    port: number;
    timestamp: number;
    success: boolean;
    message: string;
}
