"""
Image Analysis Module
Provides dominant color extraction from images
"""

import requests
from io import BytesIO
from collections import Counter
import numpy as np

# Try to import PIL, provide fallback if not available
try:
    from PIL import Image
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False
    print("Warning: PIL not installed. Image analysis will use fallback method.")

def analyze_image_colors(image_url: str, num_colors: int = 5) -> list:
    """
    Extract dominant colors from an image
    
    Args:
        image_url: URL to image
        num_colors: Number of dominant colors to extract
        
    Returns:
        List of hex color codes
    """
    if not PIL_AVAILABLE:
        # Return default colors if PIL is not available
        return ['#1DB954', '#191414', '#FFFFFF', '#B3B3B3', '#535353']
    
    try:
        # Download image
        response = requests.get(image_url, timeout=10)
        response.raise_for_status()
        
        # Open image
        img = Image.open(BytesIO(response.content))
        
        # Convert to RGB
        img = img.convert('RGB')
        
        # Resize for faster processing
        img = img.resize((150, 150))
        
        # Get pixel data
        pixels = list(img.getdata())
        
        # Use k-means-like clustering to find dominant colors
        dominant_colors = get_dominant_colors(pixels, num_colors)
        
        # Convert to hex
        hex_colors = [rgb_to_hex(color) for color in dominant_colors]
        
        return hex_colors
        
    except Exception as e:
        raise Exception(f"Image analysis failed: {str(e)}")

def get_dominant_colors(pixels: list, num_colors: int) -> list:
    """
    Get dominant colors using simple color quantization
    
    Args:
        pixels: List of RGB tuples
        num_colors: Number of colors to extract
        
    Returns:
        List of RGB tuples
    """
    # Quantize colors to reduce variation
    quantized_pixels = []
    for r, g, b in pixels:
        # Round to nearest 32 (reduce to 8 levels per channel)
        qr = round(r / 32) * 32
        qg = round(g / 32) * 32
        qb = round(b / 32) * 32
        quantized_pixels.append((qr, qg, qb))
    
    # Count color frequency
    color_counts = Counter(quantized_pixels)
    
    # Get most common colors
    dominant = [color for color, count in color_counts.most_common(num_colors)]
    
    return dominant

def rgb_to_hex(rgb: tuple) -> str:
    """
    Convert RGB tuple to hex color code
    
    Args:
        rgb: Tuple of (r, g, b) values
        
    Returns:
        Hex color code string
    """
    return '#{:02x}{:02x}{:02x}'.format(rgb[0], rgb[1], rgb[2])

def get_color_palette(image_url: str) -> dict:
    """
    Get a complete color palette analysis
    
    Args:
        image_url: URL to image
        
    Returns:
        Dictionary with color analysis
    """
    colors = analyze_image_colors(image_url, num_colors=5)
    
    return {
        'dominantColors': colors,
        'primary': colors[0] if colors else '#000000',
        'secondary': colors[1] if len(colors) > 1 else '#FFFFFF',
        'accent': colors[2] if len(colors) > 2 else '#808080'
    }
