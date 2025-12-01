"""
Audio Analysis Module
Provides audio feature extraction using librosa
"""

import librosa
import numpy as np
import requests
import tempfile
import os

def analyze_audio_features(audio_url: str) -> dict:
    """
    Analyze audio file and extract features
    
    Args:
        audio_url: URL to audio file
        
    Returns:
        Dictionary with audio features
    """
    try:
        # Download audio file
        response = requests.get(audio_url, timeout=30)
        response.raise_for_status()
        
        # Save to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as tmp_file:
            tmp_file.write(response.content)
            tmp_path = tmp_file.name
        
        try:
            # Load audio file
            y, sr = librosa.load(tmp_path, duration=30)  # Analyze first 30 seconds
            
            # Extract features
            features = {}
            
            # Tempo (BPM)
            tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
            features['tempo'] = float(tempo)
            
            # Spectral centroid (brightness)
            spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)
            features['spectral_centroid'] = float(np.mean(spectral_centroids))
            
            # Zero crossing rate (percussiveness)
            zcr = librosa.feature.zero_crossing_rate(y)
            features['zero_crossing_rate'] = float(np.mean(zcr))
            
            # RMS energy
            rms = librosa.feature.rms(y=y)
            features['energy'] = float(np.mean(rms))
            
            # Normalize energy to 0-1 scale
            features['energy'] = min(features['energy'] * 10, 1.0)
            
            # MFCC (Mel-frequency cepstral coefficients)
            mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
            features['mfcc_mean'] = float(np.mean(mfccs))
            
            # Chroma features (harmony)
            chroma = librosa.feature.chroma_stft(y=y, sr=sr)
            features['chroma_mean'] = float(np.mean(chroma))
            
            # Estimate danceability (simplified)
            # Based on tempo and rhythm strength
            features['danceability'] = estimate_danceability(y, sr, tempo)
            
            # Estimate valence (simplified)
            # Based on mode and brightness
            features['valence'] = estimate_valence(y, sr)
            
            return features
            
        finally:
            # Clean up temporary file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
                
    except Exception as e:
        raise Exception(f"Audio analysis failed: {str(e)}")

def estimate_danceability(y: np.ndarray, sr: int, tempo: float) -> float:
    """
    Estimate danceability based on rhythm and tempo
    
    Args:
        y: Audio time series
        sr: Sampling rate
        tempo: Detected tempo
        
    Returns:
        Danceability score (0-1)
    """
    # Onset strength (rhythm clarity)
    onset_env = librosa.onset.onset_strength(y=y, sr=sr)
    onset_strength = np.mean(onset_env)
    
    # Normalize tempo to 0-1 scale (optimal dance tempo: 120-130 BPM)
    tempo_score = 1.0 - abs(tempo - 125) / 125
    tempo_score = max(0, min(1, tempo_score))
    
    # Combine factors
    danceability = (onset_strength / 10 + tempo_score) / 2
    return float(min(danceability, 1.0))

def estimate_valence(y: np.ndarray, sr: int) -> float:
    """
    Estimate valence (musical positiveness) based on spectral features
    
    Args:
        y: Audio time series
        sr: Sampling rate
        
    Returns:
        Valence score (0-1)
    """
    # Spectral brightness (positive correlation with valence)
    spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
    brightness = np.mean(spectral_centroid) / (sr / 2)  # Normalize
    
    # Energy (positive correlation with valence)
    rms = librosa.feature.rms(y=y)
    energy = np.mean(rms)
    
    # Combine factors
    valence = (brightness + min(energy * 10, 1.0)) / 2
    return float(min(valence, 1.0))
