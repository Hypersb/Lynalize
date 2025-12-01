import axios from 'axios'

interface SpotifyAudioFeatures {
  tempo?: number
  energy?: number
  danceability?: number
  valence?: number
}

/**
 * Get Spotify track audio features
 */
export async function getSpotifyFeatures(
  url: string
): Promise<SpotifyAudioFeatures | null> {
  try {
    // Extract track ID from Spotify URL
    const trackIdMatch = url.match(/track\/([a-zA-Z0-9]+)/)
    if (!trackIdMatch) {
      return null
    }

    const trackId = trackIdMatch[1]

    // Get Spotify access token
    const token = await getSpotifyToken()
    if (!token) {
      return null
    }

    // Get audio features
    const response = await axios.get(
      `https://api.spotify.com/v1/audio-features/${trackId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    return {
      tempo: response.data.tempo,
      energy: response.data.energy,
      danceability: response.data.danceability,
      valence: response.data.valence,
    }
  } catch (error) {
    console.error('Spotify features error:', error)
    return null
  }
}

/**
 * Get Spotify access token
 */
async function getSpotifyToken(): Promise<string | null> {
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      console.warn('Spotify credentials not configured')
      return null
    }

    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        },
      }
    )

    return response.data.access_token
  } catch (error) {
    console.error('Spotify token error:', error)
    return null
  }
}
