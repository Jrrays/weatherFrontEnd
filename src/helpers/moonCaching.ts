interface CachePayload<T> {
    timestamp: number,
    data: T
}

const CACHE_KEY = 'moon_data_cache'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 //1 day in ms

export const getCachedMoon = <T>(): T | null => {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached)
        return null

    try {
        const parsed: CachePayload<T> = JSON.parse(cached)
        const isExpired = Date.now() - parsed.timestamp > CACHE_TTL_MS

        if (isExpired) {
            localStorage.removeItem(CACHE_KEY)
            return null
        }

        return parsed.data
    } catch {
        localStorage.removeItem(CACHE_KEY)
        return null
    }
}

export const setCachedMoon = <T>(data: T): void => {
    const payload: CachePayload<T> = {
        timestamp: Date.now(),
        data
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
}