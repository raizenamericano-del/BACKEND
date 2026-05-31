import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import {
  FiSearch, FiYoutube, FiGithub, FiBookOpen, FiImage,
  FiLoader, FiExternalLink, FiStar, FiCode, FiEye,
  FiClock, FiUser
} from 'react-icons/fi';
import { searchYouTube, searchGitHub, searchWiki } from '@/lib/api';

const tabs = [
  { id: 'youtube', label: 'YouTube', icon: FiYoutube },
  { id: 'github', label: 'GitHub', icon: FiGithub },
  { id: 'wiki', label: 'Wikipedia', icon: FiBookOpen },
  { id: 'pinterest', label: 'Pinterest', icon: FiImage },
];

interface YouTubeResult {
  id: string;
  title: string;
  thumbnail: string;
  uploader: string;
  duration: number;
  views: number;
  published: string;
  url: string;
}

interface GitHubResult {
  id: number;
  name: string;
  fullName: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language: string;
  owner: { name: string; avatar: string };
  updated: string;
}

interface WikiResult {
  id: number;
  title: string;
  snippet: string;
  extract: string;
  thumbnail: string;
  url: string;
}

export default function ScraperSection() {
  const [activeTab, setActiveTab] = useState('youtube');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const [ytResults, setYtResults] = useState<YouTubeResult[]>([]);
  const [ghResults, setGhResults] = useState<GitHubResult[]>([]);
  const [wikiResults, setWikiResults] = useState<WikiResult[]>([]);
  const [pinUrl, setPinUrl] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error('Enter a search query');
      return;
    }

    setLoading(true);

    try {
      switch (activeTab) {
        case 'youtube': {
          const yt = await searchYouTube(query);
          if (yt.success) setYtResults(yt.results || []);
          break;
        }
        case 'github': {
          const gh = await searchGitHub(query);
          if (gh.success) setGhResults(gh.results || []);
          break;
        }
        case 'wiki': {
          const wiki = await searchWiki(query);
          if (wiki.success) setWikiResults(wiki.results || []);
          break;
        }
      }
    } catch (err) {
      toast.error('Search failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePinterestDownload = () => {
    if (!pinUrl.trim()) {
      toast.error('Enter a Pinterest URL');
      return;
    }
    window.open(`https://pinterestvideo.com/?url=${encodeURIComponent(pinUrl)}`, '_blank');
    toast.info('Opening Pinterest downloader...');
  };

  const formatNumber = (n: number) => {
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
    return n.toString();
  };

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <section id="scraper" className="relative py-24 bg-[#08060f]">
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

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full glass-card border-magenta-500/20">
            <FiSearch className="w-4 h-4 text-magenta-400" />
            <span className="text-xs font-medium text-magenta-400 tracking-wide uppercase">
              Media Scraper
            </span>
          </div>
          <h2 className="font-orbitron text-3xl sm:text-4xl font-bold text-white mb-4">
            Search & <span className="gradient-text">Scrape</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Search YouTube videos, GitHub repos, Wikipedia articles, and download Pinterest pins.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex bg-[#0d0a18] rounded-xl p-1 border border-purple-500/20">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-10"
        >
          {activeTab !== 'pinterest' ? (
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={`Search ${activeTab}...`}
                className="w-full pl-5 pr-28 py-4 bg-[#0d0a18] border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-cyan-400 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <FiLoader className="w-4 h-4 animate-spin" />
                ) : (
                  <FiSearch className="w-4 h-4" />
                )}
                Search
              </button>
            </div>
          ) : (
            <div className="relative">
              <input
                type="url"
                value={pinUrl}
                onChange={(e) => setPinUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePinterestDownload()}
                placeholder="Paste Pinterest pin URL..."
                className="w-full pl-5 pr-36 py-4 bg-[#0d0a18] border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
              <button
                onClick={handlePinterestDownload}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-pink-500 text-white font-semibold rounded-lg hover:from-red-500 hover:to-pink-400 transition-all flex items-center gap-2 text-sm"
              >
                <FiImage className="w-4 h-4" />
                Download
              </button>
            </div>
          )}
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {/* YouTube Results */}
          {activeTab === 'youtube' && ytResults.length > 0 && (
            <motion.div
              key="yt"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {ytResults.map((video, i) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-xl overflow-hidden hover:border-purple-500/40 transition-all group cursor-pointer"
                  onClick={() => window.open(video.url, '_blank')}
                >
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 rounded text-xs text-white font-medium">
                      {formatDuration(video.duration)}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-sm font-medium text-white line-clamp-2 mb-2 group-hover:text-purple-300 transition-colors">
                      {video.title}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FiUser className="w-3 h-3" />
                        {video.uploader}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiEye className="w-3 h-3" />
                        {formatNumber(video.views)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">{video.published}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* GitHub Results */}
          {activeTab === 'github' && ghResults.length > 0 && (
            <motion.div
              key="gh"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {ghResults.map((repo, i) => (
                <motion.a
                  key={repo.id}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-xl p-5 hover:border-purple-500/40 transition-all group"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={repo.owner.avatar}
                      alt={repo.owner.name}
                      className="w-10 h-10 rounded-full border border-purple-500/20"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors truncate">
                        {repo.fullName}
                      </h4>
                      <p className="text-xs text-gray-500">{repo.language || 'Unknown'}</p>
                    </div>
                    <FiExternalLink className="w-4 h-4 text-gray-600 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4">{repo.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiStar className="w-3 h-3 text-yellow-500" />
                      {formatNumber(repo.stars)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiCode className="w-3 h-3" />
                      {formatNumber(repo.forks)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiClock className="w-3 h-3" />
                      {new Date(repo.updated).toLocaleDateString()}
                    </span>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          )}

          {/* Wikipedia Results */}
          {activeTab === 'wiki' && wikiResults.length > 0 && (
            <motion.div
              key="wiki"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {wikiResults.map((article, i) => (
                <motion.a
                  key={article.id}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-xl p-5 hover:border-cyan-500/40 transition-all group flex gap-4"
                >
                  {article.thumbnail && (
                    <img
                      src={article.thumbnail}
                      alt={article.title}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors mb-1">
                      {article.title}
                    </h4>
                    <p className="text-sm text-gray-400 line-clamp-3">
                      {article.extract || article.snippet}
                    </p>
                  </div>
                  <FiExternalLink className="w-5 h-5 text-gray-600 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                </motion.a>
              ))}
            </motion.div>
          )}

          {/* Pinterest Info */}
          {activeTab === 'pinterest' && (
            <motion.div
              key="pin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-10"
            >
              <div className="glass-card rounded-xl p-8 max-w-md mx-auto">
                <FiImage className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Pinterest Downloader</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Paste a Pinterest pin URL to download images and videos.
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Supported formats:</p>
                  <p className="text-gray-400">Images (HD) • Videos • GIFs</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty states */}
        {!loading && activeTab === 'youtube' && ytResults.length === 0 && query && (
          <div className="text-center py-10 text-gray-500">No results found</div>
        )}
        {!loading && activeTab === 'github' && ghResults.length === 0 && query && (
          <div className="text-center py-10 text-gray-500">No repositories found</div>
        )}
        {!loading && activeTab === 'wiki' && wikiResults.length === 0 && query && (
          <div className="text-center py-10 text-gray-500">No articles found</div>
        )}
      </div>
    </section>
  );
}
