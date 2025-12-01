from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Import analysis modules
from text_analyzer import analyze_text_sentiment, analyze_word_frequency
# from audio_analyzer import analyze_audio_features  # Requires librosa (optional)
from image_analyzer import analyze_image_colors

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

PORT = int(os.getenv('PORT', 5001))

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'OK',
        'service': 'Lynalyze Python Microservices',
        'version': '1.0.0'
    })

# Text analysis endpoint
@app.route('/analyze/text', methods=['POST'])
def analyze_text():
    """
    Analyze text for sentiment and word frequency
    
    Expected JSON:
    {
        "text": "Sample text to analyze"
    }
    """
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400
        
        # Perform sentiment analysis
        sentiment = analyze_text_sentiment(text)
        
        # Perform word frequency analysis
        word_freq = analyze_word_frequency(text)
        
        # Count words
        word_count = len(text.split())
        
        return jsonify({
            'wordCount': word_count,
            'wordFrequency': word_freq,
            'sentiment': sentiment
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Audio analysis endpoint
@app.route('/analyze/audio', methods=['POST'])
def analyze_audio():
    """
    Analyze audio file for features (DISABLED - requires librosa)
    
    Expected JSON:
    {
        "audio_url": "URL to audio file"
    }
    """
    return jsonify({
        'error': 'Audio analysis is currently disabled. Install librosa to enable this feature.',
        'tempo': 120,
        'energy': 0.5,
        'danceability': 0.5,
        'valence': 0.5
    }), 501

# Image analysis endpoint
@app.route('/analyze/image', methods=['POST'])
def analyze_image():
    """
    Analyze image for dominant colors
    
    Expected JSON:
    {
        "image_url": "URL to image"
    }
    """
    try:
        data = request.get_json()
        image_url = data.get('image_url', '')
        
        if not image_url:
            return jsonify({'error': 'Image URL is required'}), 400
        
        colors = analyze_image_colors(image_url)
        
        return jsonify({'dominantColors': colors})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print(f'🐍 Python Microservices running on http://localhost:{PORT}')
    app.run(host='0.0.0.0', port=PORT, debug=os.getenv('FLASK_ENV') == 'development')
