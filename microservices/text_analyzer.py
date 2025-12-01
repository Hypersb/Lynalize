"""
Text Analysis Module
Provides sentiment analysis and word frequency analysis
"""

import re
from collections import Counter
from textblob import TextBlob
import nltk

# Download required NLTK data (run once)
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Get English stopwords
STOP_WORDS = set(stopwords.words('english'))

def analyze_text_sentiment(text: str) -> dict:
    """
    Analyze the sentiment of text using TextBlob
    
    Args:
        text: Input text to analyze
        
    Returns:
        Dictionary with sentiment analysis results
    """
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity  # -1 to 1
    subjectivity = blob.sentiment.subjectivity  # 0 to 1
    
    # Determine sentiment label
    if polarity > 0.1:
        label = 'Positive'
    elif polarity < -0.1:
        label = 'Negative'
    else:
        label = 'Neutral'
    
    # Calculate positive, negative, neutral percentages
    # Normalize polarity from [-1, 1] to percentages
    if polarity > 0:
        positive = polarity
        negative = 0
        neutral = 1 - polarity
    elif polarity < 0:
        positive = 0
        negative = abs(polarity)
        neutral = 1 - abs(polarity)
    else:
        positive = 0
        negative = 0
        neutral = 1.0
    
    return {
        'score': round(polarity, 3),
        'label': label,
        'positive': round(positive, 3),
        'negative': round(negative, 3),
        'neutral': round(neutral, 3),
        'subjectivity': round(subjectivity, 3)
    }

def analyze_word_frequency(text: str, top_n: int = 50) -> dict:
    """
    Analyze word frequency in text
    
    Args:
        text: Input text to analyze
        top_n: Number of top frequent words to return
        
    Returns:
        Dictionary of word frequencies
    """
    # Clean text: lowercase, remove punctuation, tokenize
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    
    # Tokenize
    words = word_tokenize(text)
    
    # Remove stopwords and short words
    words = [word for word in words if word not in STOP_WORDS and len(word) > 2]
    
    # Count frequencies
    word_freq = Counter(words)
    
    # Get top N words
    top_words = dict(word_freq.most_common(top_n))
    
    return top_words

def extract_keywords(text: str, n: int = 10) -> list:
    """
    Extract keywords from text
    
    Args:
        text: Input text
        n: Number of keywords to extract
        
    Returns:
        List of keywords
    """
    word_freq = analyze_word_frequency(text, top_n=n)
    return list(word_freq.keys())

def summarize_text(text: str, sentences: int = 3) -> str:
    """
    Generate a simple summary of the text
    
    Args:
        text: Input text
        sentences: Number of sentences in summary
        
    Returns:
        Summary text
    """
    blob = TextBlob(text)
    sentences_list = blob.sentences[:sentences]
    return ' '.join(str(s) for s in sentences_list)
