/**
 * KyyDL Backend API
 * All Downloader & Scraper Service
 * Stack: Node.js + Express + Axios
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');
const NodeCache = require('node-cache');

const app = express();
const cache = new NodeCache({ stdTTL: 300 }); // 5 min cache

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ============ CONFIG ============
const PORT = process.env.PORT || 3000;
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// Cobalt API instances (fallback chain)
const COBALT_INSTANCES = [
  'https://co.wuk.sh',
  'https://cobalt.canine.wf',
  'https://api.cobalt.best'
];

// ============ PLATFORM DETECTION ============
function detectPlatform(url) {
  const patterns = {
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
    streamable: /streamable\.com\//i
  };

  for (const [platform, regex] of Object.entries(patterns)) {
    if (regex.test(url)) return platform;
  }
  return 'unknown';
}

// ============ COBALT API CALLER ============
async function callCobalt(url, options = {}) {
  const { isAudioOnly = false, aFormat = 'mp3' } = options;

  for (const instance of COBALT_INSTANCES) {
    try {
      const response = await axios.post(
        `${instance}/api/json`,
        {
          url,
          isAudioOnly,
          aFormat,
          filenamePattern: 'basic',
          dubLang: 'en'
        },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': USER_AGENT
          },
          timeout: 15000
        }
      );

      if (response.data && (response.data.url || response.data.status === 'success')) {
        return {
          success: true,
          data: response.data,
          instance
        };
      }
    } catch (err) {
      console.log(`Cobalt instance ${instance} failed:`, err.message);
      continue;
    }
  }
  return { success: false, error: 'All Cobalt instances failed' };
}

// ============ FALLBACK: SAVEFROM.NET ============
async function savefromFallback(url) {
  try {
    const response = await axios.get('https://savefrom.net/savefrom.php', {
      params: { url },
      headers: { 'User-Agent': USER_AGENT },
      timeout: 15000
    });
    if (response.data && response.data.url) {
      return {
        success: true,
        url: response.data.url,
        title: response.data.title || 'Download',
        thumbnail: response.data.thumbnail || ''
      };
    }
  } catch (err) {
    console.log('SaveFrom fallback failed:', err.message);
  }
  return { success: false };
}

// ============ FALLBACK: Y2MATE FOR YOUTUBE ============
async function y2mateFallback(videoUrl) {
  try {
    const videoId = videoUrl.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/)?.[1];
    if (!videoId) return { success: false };

    // Get info
    const infoRes = await axios.post(
      'https://www.y2mate.com/mates/analyzeV2/ajax',
      qs.stringify({
        k_query: `https://youtube.com/watch?v=${videoId}`,
        k_page: 'home',
        hl: 'en',
        q_auto: 0
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': USER_AGENT
        },
        timeout: 15000
      }
    );

    if (infoRes.data && infoRes.data.links && infoRes.data.links.mp4) {
      const qualities = Object.values(infoRes.data.links.mp4);
      const best = qualities[qualities.length - 1];
      return {
        success: true,
        title: infoRes.data.title || 'YouTube Video',
        thumbnail: infoRes.data.thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        duration: infoRes.data.time || '',
        links: infoRes.data.links
      };
    }
  } catch (err) {
    console.log('Y2Mate fallback failed:', err.message);
  }
  return { success: false };
}

// ============ FALLBACK: SSSTIK FOR TIKTOK ============
async function sssTikFallback(url) {
  try {
    const response = await axios.post(
      'https://ssstik.io/abc?url=dl',
      qs.stringify({ id: url, locale: 'en' }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': USER_AGENT,
          'Referer': 'https://ssstik.io/'
        },
        timeout: 15000
      }
    );

    const $ = cheerio.load(response.data);
    const downloadLink = $('a.without_watermark').attr('href');
    const title = $('h2').text().trim();
    const thumbnail = $('img.result_author').attr('src') || '';

    if (downloadLink) {
      return {
        success: true,
        url: downloadLink,
        title: title || 'TikTok Video',
        thumbnail
      };
    }
  } catch (err) {
    console.log('SSSTik fallback failed:', err.message);
  }
  return { success: false };
}

// ============ EXTERNAL REDIRECT FALLBACK ============
function getExternalRedirect(url, platform) {
  const redirects = {
    youtube: `https://ytmate.app/?url=${encodeURIComponent(url)}`,
    tiktok: `https://ssstik.io/download-tiktok-mp3?url=${encodeURIComponent(url)}`,
    instagram: `https://snapinsta.app/?url=${encodeURIComponent(url)}`,
    facebook: `https://fdown.net/download.php?url=${encodeURIComponent(url)}`,
    twitter: `https://ssstwitter.com/?url=${encodeURIComponent(url)}`,
    pinterest: `https://pinterestvideo.com/?url=${encodeURIComponent(url)}`
  };
  return redirects[platform] || `https://savefrom.net/?url=${encodeURIComponent(url)}`;
}

// ==========================================
// ROUTES
// ==========================================

// Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'KyyDL API',
    version: '1.0.0',
    endpoints: {
      info: '/api/info?url=VIDEO_URL',
      download: '/api/download?url=VIDEO_URL&format=mp4',
      search: {
        youtube: '/api/search/youtube?q=QUERY',
        github: '/api/search/github?q=QUERY',
        wiki: '/api/search/wiki?q=QUERY'
      }
    }
  });
});

// Get Video Info
app.get('/api/info', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ success: false, error: 'URL parameter is required' });
  }

  const platform = detectPlatform(url);
  const cacheKey = `info_${url}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    let result = {
      success: true,
      platform,
      url,
      title: '',
      thumbnail: '',
      duration: '',
      uploader: '',
      qualities: [],
      formats: ['mp4', 'mp3'],
      sources: []
    };

    // Try Cobalt API first
    const cobaltRes = await callCobalt(url);
    if (cobaltRes.success) {
      const data = cobaltRes.data;
      result.title = data.title || 'Unknown Title';
      result.thumbnail = data.thumbnail || '';
      result.duration = data.duration || '';
      result.uploader = data.author || '';
      result.qualities = data.quality ? [data.quality] : ['720p', '1080p'];
      result.sources.push({
        name: 'Cobalt',
        url: data.url || data.picker?.[0]?.url,
        quality: data.quality || 'best',
        type: data.isAudioOnly ? 'audio' : 'video'
      });
    }

    // Fallback for YouTube
    if (platform === 'youtube') {
      const y2Res = await y2mateFallback(url);
      if (y2Res.success) {
        result.title = result.title || y2Res.title;
        result.thumbnail = result.thumbnail || y2Res.thumbnail;
        result.duration = result.duration || y2Res.duration;
        if (y2Res.links && y2Res.links.mp4) {
          Object.values(y2Res.links.mp4).forEach(q => {
            result.sources.push({
              name: 'Y2Mate',
              url: q.k || '',
              quality: q.q || 'unknown',
              type: 'video',
              size: q.size || ''
            });
            if (!result.qualities.includes(q.q)) result.qualities.push(q.q);
          });
        }
      }

      // Extract video ID for thumbnail
      const videoId = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/)?.[1];
      if (videoId && !result.thumbnail) {
        result.thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
      if (!result.title) result.title = 'YouTube Video';
    }

    // Fallback for TikTok
    if (platform === 'tiktok') {
      const sssRes = await sssTikFallback(url);
      if (sssRes.success) {
        result.title = result.title || sssRes.title;
        result.thumbnail = result.thumbnail || sssRes.thumbnail;
        result.sources.push({
          name: 'SSSTik',
          url: sssRes.url,
          quality: 'HD',
          type: 'video'
        });
      }
    }

    // If no sources found, add external redirect
    if (result.sources.length === 0) {
      result.redirect = getExternalRedirect(url, platform);
      result.message = 'Direct download unavailable. Redirecting to external service.';
    }

    cache.set(cacheKey, result);
    res.json(result);

  } catch (error) {
    console.error('Info error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      redirect: getExternalRedirect(url, platform)
    });
  }
});

// Download Video
app.get('/api/download', async (req, res) => {
  const { url, format = 'mp4' } = req.query;

  if (!url) {
    return res.status(400).json({ success: false, error: 'URL parameter is required' });
  }

  const platform = detectPlatform(url);
  const isAudioOnly = format === 'mp3';

  try {
    // Try Cobalt API first
    const cobaltRes = await callCobalt(url, { isAudioOnly, aFormat: format });

    if (cobaltRes.success && cobaltRes.data.url) {
      return res.json({
        success: true,
        platform,
        url: url,
        downloadUrl: cobaltRes.data.url,
        filename: cobaltRes.data.filename || `download.${format}`,
        format,
        source: 'Cobalt API'
      });
    }

    // Fallback for YouTube MP3
    if (platform === 'youtube' && isAudioOnly) {
      const videoId = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/)?.[1];
      if (videoId) {
        return res.json({
          success: true,
          platform,
          url,
          downloadUrl: `https://youtube-mp3-download.vercel.app/api/convert?videoId=${videoId}`,
          format: 'mp3',
          source: 'YouTube MP3 API'
        });
      }
    }

    // Fallback for TikTok
    if (platform === 'tiktok') {
      const sssRes = await sssTikFallback(url);
      if (sssRes.success) {
        return res.json({
          success: true,
          platform,
          url,
          downloadUrl: sssRes.url,
          title: sssRes.title,
          thumbnail: sssRes.thumbnail,
          format,
          source: 'SSSTik'
        });
      }
    }

    // Last resort: external redirect
    const redirectUrl = getExternalRedirect(url, platform);
    res.json({
      success: true,
      platform,
      url,
      redirectUrl,
      format,
      source: 'External Redirect',
      message: 'Please use the external service to download this content'
    });

  } catch (error) {
    console.error('Download error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      redirect: getExternalRedirect(url, platform)
    });
  }
});

// YouTube Search (using Invidious API - free, no key)
app.get('/api/search/youtube', async (req, res) => {
  const { q, page = 1 } = req.query;

  if (!q) {
    return res.status(400).json({ success: false, error: 'Query parameter q is required' });
  }

  const cacheKey = `yt_search_${q}_${page}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    const invidiousInstances = [
      'https://vid.puffyan.us',
      'https://iv.datura.network',
      'https://iv.nboeck.de'
    ];

    let results = [];

    for (const instance of invidiousInstances) {
      try {
        const response = await axios.get(
          `${instance}/api/v1/search`,
          {
            params: { q, page, type: 'video' },
            headers: { 'User-Agent': USER_AGENT },
            timeout: 10000
          }
        );

        if (response.data && Array.isArray(response.data)) {
          results = response.data
            .filter(item => item.type === 'video')
            .map(item => ({
              id: item.videoId,
              title: item.title,
              thumbnail: item.videoThumbnails?.[0]?.url || `https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`,
              uploader: item.author,
              duration: item.lengthSeconds,
              views: item.viewCount,
              published: item.publishedText,
              url: `https://youtube.com/watch?v=${item.videoId}`
            }));
          break;
        }
      } catch (err) {
        console.log(`Invidious ${instance} failed:`, err.message);
        continue;
      }
    }

    const result = { success: true, query: q, results };
    cache.set(cacheKey, result);
    res.json(result);

  } catch (error) {
    console.error('YouTube search error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GitHub Search (public API, no auth needed for basic search)
app.get('/api/search/github', async (req, res) => {
  const { q, sort = 'stars', order = 'desc', page = 1 } = req.query;

  if (!q) {
    return res.status(400).json({ success: false, error: 'Query parameter q is required' });
  }

  const cacheKey = `gh_search_${q}_${page}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    const response = await axios.get('https://api.github.com/search/repositories', {
      params: { q, sort, order, page, per_page: 20 },
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'KyyDL-App'
      },
      timeout: 10000
    });

    const result = {
      success: true,
      query: q,
      total: response.data.total_count,
      results: response.data.items.map(repo => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        url: repo.html_url,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        owner: {
          name: repo.owner.login,
          avatar: repo.owner.avatar_url,
          url: repo.owner.html_url
        },
        updated: repo.updated_at
      }))
    };

    cache.set(cacheKey, result);
    res.json(result);

  } catch (error) {
    console.error('GitHub search error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Wikipedia Search (public API)
app.get('/api/search/wiki', async (req, res) => {
  const { q, limit = 10 } = req.query;

  if (!q) {
    return res.status(400).json({ success: false, error: 'Query parameter q is required' });
  }

  const cacheKey = `wiki_search_${q}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    // Step 1: Search for articles
    const searchRes = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        list: 'search',
        srsearch: q,
        srlimit: limit,
        format: 'json',
        origin: '*'
      },
      timeout: 10000
    });

    const searchResults = searchRes.data.query.search;

    // Step 2: Get page extracts and thumbnails
    const pageIds = searchResults.map(s => s.pageid).join('|');
    const detailRes = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        pageids: pageIds,
        prop: 'extracts|pageimages',
        exintro: true,
        explaintext: true,
        piprop: 'thumbnail',
        pithumbsize: 300,
        format: 'json',
        origin: '*'
      },
      timeout: 10000
    });

    const pages = detailRes.data.query.pages;

    const result = {
      success: true,
      query: q,
      results: searchResults.map(item => {
        const page = pages[item.pageid] || {};
        return {
          id: item.pageid,
          title: item.title,
          snippet: item.snippet.replace(/<[^>]*>/g, ''),
          extract: page.extract || '',
          thumbnail: page.thumbnail?.source || '',
          url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`
        };
      })
    };

    cache.set(cacheKey, result);
    res.json(result);

  } catch (error) {
    console.error('Wiki search error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Pinterest Scraper (using search-by-image or pin extraction)
app.get('/api/scrape/pinterest', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ success: false, error: 'URL parameter is required' });
  }

  try {
    // For Pinterest pins, extract media
    const response = await axios.get(url, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    const ogImage = $('meta[property="og:image"]').attr('content');
    const ogTitle = $('meta[property="og:title"]').attr('content');
    const ogDesc = $('meta[property="og:description"]').attr('content');
    const videoUrl = $('meta[property="og:video"]').attr('content');

    const images = [];
    $('img[src*="pinimg"]').each((_, el) => {
      const src = $(el).attr('src');
      if (src && src.includes('originals')) {
        images.push(src.replace('/236x/', '/originals/'));
      }
    });

    res.json({
      success: true,
      url,
      title: ogTitle || 'Pinterest Pin',
      description: ogDesc || '',
      thumbnail: ogImage || '',
      video: videoUrl || null,
      images: [...new Set(images)],
      redirect: videoUrl ? null : `https://pinterestvideo.com/?url=${encodeURIComponent(url)}`
    });

  } catch (error) {
    console.error('Pinterest scrape error:', error.message);
    res.json({
      success: false,
      error: error.message,
      redirect: `https://pinterestvideo.com/?url=${encodeURIComponent(url)}`
    });
  }
});

// Short URL creation
app.get('/api/tools/shorturl', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ success: false, error: 'URL parameter is required' });
  }

  try {
    // Try is.gd (free, no key)
    const response = await axios.get('https://is.gd/create.php', {
      params: {
        format: 'json',
        url: url
      },
      timeout: 10000
    });

    if (response.data && response.data.shorturl) {
      return res.json({
        success: true,
        original: url,
        short: response.data.shorturl
      });
    }

    // Fallback to tinyurl
    const tinyRes = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`, {
      timeout: 10000
    });

    if (tinyRes.data) {
      return res.json({
        success: true,
        original: url,
        short: tinyRes.data
      });
    }

    throw new Error('All short URL services failed');

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Screenshot tool (using screenshot API)
app.get('/api/tools/screenshot', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ success: false, error: 'URL parameter is required' });
  }

  // Return a screenshot service URL
  res.json({
    success: true,
    url,
    screenshotUrl: `https://image.thum.io/get/width/1200/crop/800/noanimate/${encodeURIComponent(url)}`,
    fullPageUrl: `https://image.thum.io/get/width/1200/fullpage/noanimate/${encodeURIComponent(url)}`
  });
});

// Translate (using MyMemory API - free)
app.get('/api/tools/translate', async (req, res) => {
  const { text, from = 'auto', to = 'en' } = req.query;

  if (!text) {
    return res.status(400).json({ success: false, error: 'Text parameter is required' });
  }

  try {
    const response = await axios.get('https://api.mymemory.translated.net/get', {
      params: {
        q: text,
        langpair: `${from}|${to}`
      },
      timeout: 10000
    });

    if (response.data && response.data.responseData) {
      res.json({
        success: true,
        original: text,
        translated: response.data.responseData.translatedText,
        from: response.data.responseData.detectedLanguage || from,
        to
      });
    } else {
      throw new Error('Translation failed');
    }

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 KyyDL API running on port ${PORT}`);
  console.log(`📡 Health check: http://0.0.0.0:${PORT}/`);
});

module.exports = app;
