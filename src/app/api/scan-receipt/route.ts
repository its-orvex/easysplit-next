import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const PROMPT = `You are reading a receipt or invoice. Extract the following and reply ONLY with valid JSON, no other text:
{
  "amount": <total amount as a number, e.g. 127.50>,
  "merchant": <business or restaurant name as a string>,
  "date": <date in DD/MM/YYYY format, or "" if not found>,
  "category": <one of: "food", "accommodation", "transport", "flights", "activities", "other">,
  "items": [
    {"name": <item name>, "price": <price as number>}
  ]
}

Rules:
- amount must be the TOTAL (look for "Total", "Amount Due", "Grand Total")
- If GST is shown separately, include it in the total
- items should be the individual line items if visible (max 10)
- If you cannot read the receipt clearly, still return valid JSON with your best guess and amount: 0 if truly unreadable
- category: food for restaurants/cafes/groceries, accommodation for hotels/airbnb, transport for uber/taxi/bus, flights for airlines, activities for tours/experiences, other for everything else`

export async function POST(req: NextRequest) {
  try {
    const { base64, mediaType = 'image/jpeg' } = await req.json()

    if (!base64) {
      return NextResponse.json({ error: 'Missing base64 image data' }, { status: 400 })
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType as any, data: base64 },
          },
          { type: 'text', text: PROMPT },
        ],
      }],
    })

    const text = (message.content[0] as any).text as string

    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      const match = text.match(/\{[\s\S]*\}/)
      if (match) parsed = JSON.parse(match[0])
      else return NextResponse.json({ error: 'Could not parse receipt data' }, { status: 422 })
    }

    return NextResponse.json(parsed)
  } catch (err: any) {
    console.error('scan-receipt error:', err)
    return NextResponse.json({ error: err.message ?? 'Receipt scan failed' }, { status: 500 })
  }
}
