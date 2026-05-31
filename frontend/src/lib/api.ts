/**
 * KyyDL API Client
 * All API calls to backend
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Platform detection
export function detectPlatform(url: string): string {
  const patterns: Record<string, RegExp> = {
    youtube: /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)/i,
    tiktok: /tiktok\.com\//i,
    instagram: /instagram\.com\/(p|reel|tv)\//i,
    facebook: /(?:facebook\.com\/.*\/(videos|reel)|fb\.watch)/i,
    twitter: /(?:twitter\.com\/\w+\/status|x\.com\/\w+\/status)/i,
    reddit: /reddit\.com\//i,
    soundcloud: /soundcloud\.com\//i,
    bilibili: /bilibili\.com\//i,
    dailymotion: /dailymotion\.com\//i,
    pinterest: /pinterest\.com\/pin\//i,
    vimeo: /vimeo\.com\//i,
    twitch: /twitch\.tv\//i,
    spotify: /spotify\.com\//i,
    github: /github\.com\//i,
    bandcamp: /bandcamp\.com\//i,
    rumble: /rumble\.com\//i,
    streamable: /streamable\.com\//i,
  };

  for (const [platform, regex] of Object.entries(patterns)) {
    if (regex.test(url)) return platform;
  }
  return 'unknown';
}

// Platform info
export const PLATFORM_INFO: Record<string, { name: string; icon: string; color: string }> = {
  youtube: { name: 'YouTube', icon: '▶️', color: '#FF0000' },
  tiktok: { name: 'TikTok', icon: '🎵', color: '#000000' },
  instagram: { name: 'Instagram', icon: '📷', color: '#E4405F' },
  facebook: { name: 'Facebook', icon: 'f', color: '#1877F2' },
  twitter: { name: 'Twitter/X', icon: '𝕏', color: '#000000' },
  reddit: { name: 'Reddit', icon: '🤖', color: '#FF4500' },
  soundcloud: { name: 'SoundCloud', icon: '☁️', color: '#FF5500' },
  bilibili: { name: 'Bilibili', icon: '📺', color: '#00A1D6' },
  dailymotion: { name: 'Dailymotion', icon: '▶️', color: '#00AAFF' },
  pinterest: { name: 'Pinterest', icon: '📌', color: '#E60023' },
  vimeo: { name: 'Vimeo', icon: '▶️', color: '#1AB7EA' },
  twitch: { name: 'Twitch', icon: '📺', color: '#9146FF' },
  spotify: { name: 'Spotify', icon: '🎵', color: '#1DB954' },
  github: { name: 'GitHub', icon: '⚡', color: '#333' },
  bandcamp: { name: 'Bandcamp', icon: '🎸', color: '#1DA0C3' },
  rumble: { name: 'Rumble', icon: '▶️', color: '#85C742' },
  streamable: { name: 'Streamable', icon: '▶️', color: '#0F90F2' },
  unknown: { name: 'Unknown', icon: '❓', color: '#666' },
};

// Supported platforms list
export const SUPPORTED_PLATFORMS = [
  'youtube', 'tiktok', 'instagram', 'facebook', 'twitter',
  'reddit', 'soundcloud', 'bilibili', 'dailymotion', 'pinterest',
  'vimeo', 'twitch', 'spotify', 'github', 'bandcamp', 'rumble', 'streamable'
];

// API: Get video info
export async function getVideoInfo(url: string) {
  const response = await api.get('/api/info', { params: { url } });
  return response.data;
}

// API: Get download link
export async function getDownloadLink(url: string, format: string = 'mp4') {
  const response = await api.get('/api/download', { params: { url, format } });
  return response.data;
}

// API: YouTube search
export async function searchYouTube(query: string) {
  const response = await api.get('/api/search/youtube', { params: { q: query } });
  return response.data;
}

// API: GitHub search
export async function searchGitHub(query: string) {
  const response = await api.get('/api/search/github', { params: { q: query } });
  return response.data;
}

// API: Wikipedia search
export async function searchWiki(query: string) {
  const response = await api.get('/api/search/wiki', { params: { q: query } });
  return response.data;
}

// API: Create short URL
export async function createShortUrl(url: string) {
  const response = await api.get('/api/tools/shorturl', { params: { url } });
  return response.data;
}

// API: Get screenshot
export async function getScreenshot(url: string) {
  const response = await api.get('/api/tools/screenshot', { params: { url } });
  return response.data;
}

// API: Translate
export async function translateText(text: string, from: string = 'auto', to: string = 'en') {
  const response = await api.get('/api/tools/translate', { params: { text, from, to } });
  return response.data;
}

export default api;
