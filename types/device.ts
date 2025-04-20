export interface Device {
    id: string;
    name: string;
    ipAddress: string;
    port: number;
}

export type NewDevice = Omit<Device, 'id'>;
