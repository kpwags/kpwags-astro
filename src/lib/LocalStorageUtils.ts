export const SetItem = (key: string, value: string) => {
    try {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, value);
        }
    } catch { /* don't really care */ }
}

export const GetItem = (key: string, defaultValue: string | null = null): string | null => {
    try {
        if (typeof window !== 'undefined') {
            const value = window.localStorage.getItem(key);

            return value || defaultValue;
        }
    } catch {
        return defaultValue;
    }

    return defaultValue;
}

export const RemoveItem = (key: string) => {
    try {
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem(key);
        }
    } catch { /* don't really care */ }
}
