import axios from 'axios'
import { JSDOM } from 'jsdom'

export interface ScrapedMetadata {
  title: string
  description: string
  images: string[]
  text: string
  favicon?: string
  author?: string
  keywords?: string[]
}

/**
 * Scrape metadata from a URL
 */
export async function scrapeUrlMetadata(url: string): Promise<ScrapedMetadata> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      timeout: 10000,
    })

    const dom = new JSDOM(response.data)
    const document = dom.window.document
    const $ = (selector: string) => document.querySelector(selector)
    const $$ = (selector: string) => document.querySelectorAll(selector)

    // Extract title
    const title =
      $('meta[property="og:title"]')?.getAttribute('content') ||
      $('meta[name="twitter:title"]')?.getAttribute('content') ||
      $('title')?.textContent ||
      'Untitled'

    // Extract description
    const description =
      $('meta[property="og:description"]')?.getAttribute('content') ||
      $('meta[name="twitter:description"]')?.getAttribute('content') ||
      $('meta[name="description"]')?.getAttribute('content') ||
      ''

    // Extract images
    const images: string[] = []
    const ogImage = $('meta[property="og:image"]')?.getAttribute('content')
    if (ogImage) images.push(ogImage)

    $$('img').forEach((elem: any) => {
      const src = elem.getAttribute('src')
      if (src && src.startsWith('http')) {
        images.push(src)
      }
    })

    // Extract favicon
    const favicon =
      $('link[rel="icon"]')?.getAttribute('href') ||
      $('link[rel="shortcut icon"]')?.getAttribute('href')

    // Extract author
    const author =
      $('meta[name="author"]')?.getAttribute('content') ||
      $('meta[property="article:author"]')?.getAttribute('content')

    // Extract keywords
    const keywordsStr = $('meta[name="keywords"]')?.getAttribute('content')
    const keywords = keywordsStr ? keywordsStr.split(',').map((k: string) => k.trim()) : []

    // Extract text content
    const paragraphs = Array.from($$('p')).map((p: any) => p.textContent || '').join(' ')
    const text = paragraphs.trim()

    return {
      title: title.trim(),
      description: description.trim(),
      images: images.slice(0, 10), // Limit to 10 images
      text: text.substring(0, 5000), // Limit text length
      favicon: favicon || undefined,
      author: author || undefined,
      keywords,
    }
  } catch (error) {
    console.error('Scraping error:', error)
    throw new Error('Failed to scrape URL')
  }
}
