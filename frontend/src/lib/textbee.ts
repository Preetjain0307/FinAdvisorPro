export const TEXTBEE_API_URL = 'https://api.textbee.dev/api/v1'

export async function sendTextBeeSms(phone: string, message: string) {
    const apiKey = process.env.TEXTBEE_API_KEY
    const deviceId = process.env.TEXTBEE_DEVICE_ID

    if (!apiKey || !deviceId) {
        console.error('Missing TextBee configuration')
        return { error: 'Server misconfigured' }
    }

    try {
        const response = await fetch(`${TEXTBEE_API_URL}/gateway/devices/${deviceId}/sendSMS`, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                recipients: [phone],
                message: message,
            })
        })

        const data = await response.json()

        if (!response.ok) {
            console.error('TextBee Error:', data)
            return { error: data.message || 'Failed to send SMS' }
        }

        return { success: true, data }

    } catch (error) {
        console.error('TextBee Network Error:', error)
        return { error: 'Failed to connect to SMS gateway' }
    }
}
