import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import {
  FiDownload, FiLink, FiCheck, FiAlertCircle, FiLoader,
  FiMusic, FiVideo, FiExternalLink,
  FiX, FiPlay, FiClock, FiUser
} from 'react-icons/fi';
import {
  detectPlatform,
  PLATFORM_INFO,
  SUPPORTED_PLATFORMS,
  getVideoInfo,
  getDownloadLink,
} from '@/lib/api';

interface VideoInfo {
  success: boolean;
  platform: string;
  title: string;
  thumbnail: string;
  duration: string;
  uploader: string;
  qualities: string[];
  formats: string[];
  sources: Array<{
    name: string;
    url: string;
    quality: string;
    type: string;
    size?: string;
  }>;
  redirect?: string;
  message?: string;
}

export default function DownloaderHub() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<'mp4' | 'mp3'>('mp4');
  const [detectedPlatform, setDetectedPlatform] = useState('');

  // Auto-detect platform as user types
  const handleUrlChange = (value: string) => {
    setUrl(value);
    if (value.length > 10) {
      const platform = detectPlatform(value);
      setDetectedPlatform(platform);
    } else {
      setDetectedPlatform('');
    }
  };

  // Analyze video
  const handleAnalyze = useCallback(async () => {
    if (!url.trim()) {
      toast.error('Please enter a video URL');
      return;
    }

    const platform = detectPlatform(url);
    if (platform === 'unknown') {
      toast.error('Unsupported platform. Please check supported platforms below.');
      return;
    }

    setLoading(true);
    setVideoInfo(null);

    try {
      const data = await getVideoInfo(url);
      if (data.success) {
        setVideoInfo(data);
        toast.success('Video info loaded!');
      } else {
        toast.error(data.error || 'Failed to get video info');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [url]);

  // Download video
  const handleDownload = useCallback(async () => {
    if (!url.trim()) return;

    setDownloading(true);

    try {
      const data = await getDownloadLink(url, selectedFormat);
      if (data.success) {
        if (data.downloadUrl) {
          // Open direct download in new tab
          window.open(data.downloadUrl, '_blank');
          toast.success(`Download started! (${selectedFormat.toUpperCase()})`);
        } else if (data.redirectUrl) {
          // Redirect to external service
          window.open(data.redirectUrl, '_blank');
          toast.info('Redirecting to external download service...');
        }
      } else {
        toast.error(data.error || 'Download failed');
      }
    } catch (error) {
      toast.error('Download error. Try again.');
    } finally {
      setDownloading(false);
    }
  }, [url, selectedFormat]);

  const platformInfo = detectedPlatform ? PLATFORM_INFO[detectedPlatform] : null;

  return (
    <section id="downloader" className="relative py-24 bg-[#08060f]">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#140f23',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            color: '#fff',
          },
        }}
      />

      {/* Background */}
      <div className="absolute inset-0 bg-cyberpunk opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full glass-card border-cyan-500/20">
            <FiDownload className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-medium text-cyan-400 tracking-wide uppercase">
              Downloader Hub
            </span>
          </div>
          <h2 className="font-orbitron text-3xl sm:text-4xl font-bold text-white mb-4">
            Paste URL & <span className="gradient-text">Download</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Supports 17+ platforms. Just paste the link and get your file instantly.
          </p>
        </motion.div>

        {/* URL Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 sm:p-8 mb-8"
        >
          {/* Input */}
          <div className="relative mb-4">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <FiLink className="w-5 h-5" />
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="Paste video URL here (YouTube, TikTok, Instagram...)"
              className="w-full pl-12 pr-32 sm:pr-40 py-4 bg-[#0d0a18] border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
            {/* Platform badge */}
            <AnimatePresence>
              {platformInfo && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute right-28 sm:right-36 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
                  style={{
                    backgroundColor: `${platformInfo.color}15`,
                    color: platformInfo.color,
                    border: `1px solid ${platformInfo.color}30`,
                  }}
                >
                  <FiCheck className="w-3 h-3" />
                  {platformInfo.name}
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={handleAnalyze}
              disabled={loading || !url.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 sm:px-6 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Analyzing</span>
                </>
              ) : (
                <>
                  <FiPlay className="w-4 h-4" />
                  <span className="hidden sm:inline">Analyze</span>
                </>
              )}
            </button>
          </div>

          {/* Supported Platforms */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-gray-500 mr-1">Supported:</span>
            {SUPPORTED_PLATFORMS.map((p) => {
              const info = PLATFORM_INFO[p];
              return (
                <span
                  key={p}
                  className={`px-2 py-0.5 text-[10px] rounded-md border transition-all ${
                    detectedPlatform === p
                      ? 'border-purple-500/40 text-purple-300 bg-purple-500/10'
                      : 'border-gray-700/50 text-gray-500 hover:border-gray-600'
                  }`}
                >
                  {info?.name || p}
                </span>
              );
            })}
          </div>
        </motion.div>

        {/* Video Info Result */}
        <AnimatePresence>
          {videoInfo && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="glass-card rounded-2xl overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                {/* Thumbnail */}
                <div className="relative md:w-72 lg:w-80 flex-shrink-0">
                  {videoInfo.thumbnail ? (
                    <img
                      src={videoInfo.thumbnail}
                      alt={videoInfo.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 md:h-full bg-gradient-to-br from-purple-900/50 to-cyan-900/50 flex items-center justify-center">
                      <FiVideo className="w-12 h-12 text-purple-400/30" />
                    </div>
                  )}
                  {videoInfo.duration && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-xs text-white font-medium flex items-center gap-1">
                      <FiClock className="w-3 h-3" />
                      {videoInfo.duration}
                    </div>
                  )}
                  <div
                    className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium text-white"
                    style={{
                      backgroundColor: PLATFORM_INFO[videoInfo.platform]?.color || '#666',
                    }}
                  >
                    {PLATFORM_INFO[videoInfo.platform]?.name || videoInfo.platform}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 p-6">
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                    {videoInfo.title || 'Untitled Video'}
                  </h3>

                  {videoInfo.uploader && (
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                      <FiUser className="w-4 h-4" />
                      {videoInfo.uploader}
                    </div>
                  )}

                  {/* Qualities */}
                  {videoInfo.qualities && videoInfo.qualities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-xs text-gray-500">Qualities:</span>
                      {videoInfo.qualities.map((q) => (
                        <span
                          key={q}
                          className="px-2 py-0.5 text-xs rounded bg-purple-500/10 text-purple-300 border border-purple-500/20"
                        >
                          {q}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Sources */}
                  {videoInfo.sources && videoInfo.sources.length > 0 && (
                    <div className="mb-4">
                      <span className="text-xs text-gray-500 mb-2 block">Sources found:</span>
                      <div className="flex flex-wrap gap-2">
                        {videoInfo.sources.map((s, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1"
                          >
                            <FiCheck className="w-3 h-3" />
                            {s.name} ({s.quality})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Format Selection */}
                  <div className="flex gap-3 mb-6">
                    <button
                      onClick={() => setSelectedFormat('mp4')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedFormat === 'mp4'
                          ? 'bg-purple-600 text-white'
                          : 'bg-[#0d0a18] text-gray-400 hover:text-white border border-gray-700'
                      }`}
                    >
                      <FiVideo className="w-4 h-4" />
                      MP4 (Video)
                    </button>
                    <button
                      onClick={() => setSelectedFormat('mp3')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedFormat === 'mp3'
                          ? 'bg-purple-600 text-white'
                          : 'bg-[#0d0a18] text-gray-400 hover:text-white border border-gray-700'
                      }`}
                    >
                      <FiMusic className="w-4 h-4" />
                      MP3 (Audio)
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleDownload}
                      disabled={downloading}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-cyan-400 transition-all disabled:opacity-50 neon-glow-purple"
                    >
                      {downloading ? (
                        <FiLoader className="w-5 h-5 animate-spin" />
                      ) : (
                        <FiDownload className="w-5 h-5" />
                      )}
                      Download {selectedFormat.toUpperCase()}
                    </button>

                    {videoInfo.redirect && (
                      <a
                        href={videoInfo.redirect}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 border border-cyan-500/30 text-cyan-400 font-medium rounded-xl hover:bg-cyan-500/10 transition-all"
                      >
                        <FiExternalLink className="w-5 h-5" />
                        Alternative
                      </a>
                    )}

                    <button
                      onClick={() => {
                        setUrl('');
                        setVideoInfo(null);
                        setDetectedPlatform('');
                      }}
                      className="flex items-center gap-2 px-4 py-3 border border-gray-700 text-gray-400 rounded-xl hover:border-gray-500 hover:text-white transition-all"
                    >
                      <FiX className="w-5 h-5" />
                      Clear
                    </button>
                  </div>

                  {videoInfo.message && (
                    <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-yellow-400">
                        <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                        {videoInfo.message}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Skeleton */}
        <AnimatePresence>
          {loading && !videoInfo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-72 h-48 bg-[#0d0a18] rounded-xl animate-pulse" />
                <div className="flex-1 space-y-4">
                  <div className="h-6 bg-[#0d0a18] rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-[#0d0a18] rounded animate-pulse w-1/2" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-[#0d0a18] rounded animate-pulse" />
                    <div className="h-6 w-16 bg-[#0d0a18] rounded animate-pulse" />
                  </div>
                  <div className="h-10 w-32 bg-[#0d0a18] rounded animate-pulse" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
