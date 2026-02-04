/**
 * Next.js API Route: /api/market-data
 * 
 * Fetches live stock prices from Alpha Vantage API
 * 
 * Usage: GET /api/market-data?symbol=AAPL
 */

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const symbol = searchParams.get('symbol')

        if (!symbol) {
            return Response.json(
                { error: 'Stock symbol is required' },
                { status: 400 }
            )
        }

        const apiKey = process.env.ALPHA_VANTAGE_API_KEY

        if (!apiKey) {
            console.warn('ALPHA_VANTAGE_API_KEY not configured')
            return Response.json(
                { error: 'API key not configured', fallback: true },
                { status: 503 }
            )
        }

        // Fetch from Alpha Vantage
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`

        const res = await fetch(url, {
            next: { revalidate: 60 } // Cache for 60 seconds
        })

        if (!res.ok) {
            throw new Error(`Alpha Vantage API error: ${res.status}`)
        }

        const data = await res.json()

        // Check for API error messages
        if (data['Error Message']) {
            return Response.json(
                { error: 'Invalid stock symbol', symbol },
                { status: 404 }
            )
        }

        if (data['Note']) {
            // Rate limit reached
            return Response.json(
                { error: 'API rate limit reached. Please try again later.', rateLimited: true },
                { status: 429 }
            )
        }

        // Parse the response
        const quote = data['Global Quote']

        if (!quote || Object.keys(quote).length === 0) {
            return Response.json(
                { error: 'No data available for this symbol', symbol },
                { status: 404 }
            )
        }

        // Format the response
        const formattedData = {
            symbol: quote['01. symbol'],
            price: parseFloat(quote['05. price']),
            change: parseFloat(quote['09. change']),
            changePercent: quote['10. change percent'],
            volume: parseInt(quote['06. volume']),
            lastUpdated: quote['07. latest trading day'],
            previousClose: parseFloat(quote['08. previous close']),
        }

        return Response.json({
            success: true,
            data: formattedData,
            timestamp: new Date().toISOString()
        })

    } catch (error) {
        console.error('Market data API error:', error)
        return Response.json(
            { error: 'Failed to fetch market data', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
