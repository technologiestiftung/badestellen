import type { Context } from '@netlify/functions'

export default async (req: Request, context: Context) => {
  const username = Netlify.env.get('SWIM_API_USER')
  const password = Netlify.env.get('SWIM_API_PASSWORD')
  const url = Netlify.env.get('SWIM_API_URL')
  if (!username || !password || !url) {
    return new Response('Missing required environment variables')
  }
  const auth = `Basic ${btoa(`${username}:${password}`)}`
  const options = {
    method: 'GET',
    headers: {
      Authorization: auth
    }
  }

  try {
    const response = await fetch(url, options)
    if (!response.ok) {
      return new Response('Failed to fetch data from Swim API', {
        status: response.status
      })
    }
    const data = await response.json()
    const alteredData = data.map((m: any) => {
      const { id, badestellen_id } = m
      const item = { ...m, id: badestellen_id, swim_id: id }
      return item
    })
    return new Response(JSON.stringify(alteredData), {
      headers: {
        'Access-Control-Allow-Origin': '*', // Allow from anywhere
        'Access-Control-Allow-Methods': 'GET', // Allow these HTTP methods
        'Access-Control-Allow-Headers': 'Content-Type', // Allow Content-Type header
        'content-type': 'application/json'
      }
    })
  } catch (error) {
    console.error(error)
    return new Response('Failed to fetch data from Swim API', { status: 500 })
  }
}
