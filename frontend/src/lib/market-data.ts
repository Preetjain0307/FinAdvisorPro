/**
 * Market Data Utility Functions
 * 
 * Fetches and manages live stock price data from Alpha Vantage
 */

export interface MarketData {
    symbol: string
    price: number
    change: number
    changePercent: string
    volume: number
    lastUpdated: string
    previousClose: number
}

export interface MarketDataResponse {
    success: boolean
    data?: MarketData
    error?: string
    timestamp: string
    rateLimited?: boolean
    fallback?: boolean
}

// In-memory cache for market data
const cache = new Map<string, { data: MarketDataResponse; timestamp: number }>()
const CACHE_DURATION = 60 * 1000 // 60 seconds (Client side cache matching API)

// Rate Limiting Queue System
const RATE_LIMIT_DELAY = 15000 // 15 seconds between calls (4 calls/min to be safe)
let requestQueue: { symbol: string; resolve: (value: MarketDataResponse) => void }[] = []
let isProcessingQueue = false

async function processQueue() {
    if (isProcessingQueue || requestQueue.length === 0) return

    isProcessingQueue = true

    while (requestQueue.length > 0) {
        const item = requestQueue.shift()
        if (!item) break

        try {
            // Fetch the data
            const res = await fetch(`/api/market-data?symbol=${item.symbol}`)
            const data: MarketDataResponse = await res.json()

            // Cache successful responses
            if (data.success) {
                cache.set(item.symbol, { data, timestamp: Date.now() })
            }

            item.resolve(data)
        } catch (error) {
            console.error(`Failed to fetch price for ${item.symbol}:`, error)
            item.resolve({
                success: false,
                error: 'Network error',
                timestamp: new Date().toISOString()
            })
        }

        // Wait before next request to respect rate limit
        if (requestQueue.length > 0) {
            await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY))
        }
    }

    isProcessingQueue = false
}

/**
 * Fetch live price for a stock symbol
 * Uses a queue system to prevent rate limiting
 */
export function fetchLivePrice(symbol: string): Promise<MarketDataResponse> {
    // Check cache first
    const cached = cache.get(symbol)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return Promise.resolve(cached.data)
    }

    // Return a promise that resolves when the queue processes this request
    return new Promise((resolve) => {
        requestQueue.push({ symbol, resolve })
        processQueue()
    })
}

/**
 * Fetch prices for multiple symbols
 */
export async function fetchMultiplePrices(symbols: string[]): Promise<Map<string, MarketDataResponse>> {
    const results = new Map<string, MarketDataResponse>()

    // Fetch sequentially to avoid rate limits
    for (const symbol of symbols) {
        const data = await fetchLivePrice(symbol)
        results.set(symbol, data)

        // Small delay between requests to be respectful of API limits
        await new Promise(resolve => setTimeout(resolve, 200))
    }

    return results
}

/**
 * Format price change for display
 */
export function formatPriceChange(change: number, changePercent: string): {
    formatted: string
    color: 'green' | 'red' | 'gray'
    icon: '↑' | '↓' | '→'
} {
    if (change > 0) {
        return {
            formatted: `+${change.toFixed(2)} (${changePercent})`,
            color: 'green',
            icon: '↑'
        }
    } else if (change < 0) {
        return {
            formatted: `${change.toFixed(2)} (${changePercent})`,
            color: 'red',
            icon: '↓'
        }
    } else {
        return {
            formatted: `0.00 (0%)`,
            color: 'gray',
            icon: '→'
        }
    }
}

/**
 * Clear cache (useful for testing)
 */
export function clearCache() {
    cache.clear()
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
    return {
        size: cache.size,
        entries: Array.from(cache.entries()).map(([symbol, { timestamp }]) => ({
            symbol,
            age: Date.now() - timestamp,
            expired: Date.now() - timestamp > CACHE_DURATION
        }))
    }
}
