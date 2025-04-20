export function generateId(): string {
    return (
        Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );
}

export function formatDateTime(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleString();
}

export function validateIpAddress(ip: string): boolean {
    const ipRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;

    if (!ipRegex.test(ip)) {
        return false;
    }

    const parts = ip.split('.').map((part) => parseInt(part, 10));
    return parts.every((part) => part >= 0 && part <= 255);
}

export function validatePort(port: number): boolean {
    return port >= 1 && port <= 65535;
}
