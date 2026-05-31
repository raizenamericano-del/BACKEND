import { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import {
  FiLink, FiGrid, FiCamera, FiType, FiCopy, FiCheck,
  FiExternalLink, FiDownload, FiLoader
} from 'react-icons/fi';
import { createShortUrl, getScreenshot, translateText } from '@/lib/api';
import QRCode from 'react-qr-code';

const tools = [
  { id: 'shortlink', label: 'Short URL', icon: FiLink },
  { id: 'qr', label: 'QR Code', icon: FiGrid },
  { id: 'screenshot', label: 'Screenshot', icon: FiCamera },
  { id: 'translate', label: 'Translate', icon: FiType },
];

export default function ToolsSection() {
  const [activeTool, setActiveTool] = useState('shortlink');

  // Shortlink state
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [shortLoading, setShortLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // QR state
  const [qrUrl, setQrUrl] = useState('');
  const [qrValue, setQrValue] = useState('');

  // Screenshot state
  const [ssUrl, setSsUrl] = useState('');
  const [ssResult, setSsResult] = useState('');
  const [ssLoading, setSsLoading] = useState(false);

  // Translate state
  const [transText, setTransText] = useState('');
  const [transResult, setTransResult] = useState('');
  const [transFrom, setTransFrom] = useState('auto');
  const [transTo, setTransTo] = useState('en');
  const [transLoading, setTransLoading] = useState(false);

  const handleShorten = async () => {
    if (!longUrl.trim()) { toast.error('Enter a URL'); return; }
    setShortLoading(true);
    try {
      const data = await createShortUrl(longUrl);
      if (data.success) {
        setShortUrl(data.short);
        toast.success('URL shortened!');
      } else {
        toast.error(data.error || 'Failed');
      }
    } catch {
      // Fallback to tinyurl
      setShortUrl(`https://tinyurl.com/create.php?url=${encodeURIComponent(longUrl)}`);
      toast.info('Using fallback service');
    }
    setShortLoading(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateQR = () => {
    if (!qrUrl.trim()) { toast.error('Enter text or URL'); return; }
    setQrValue(qrUrl);
    toast.success('QR Code generated!');
  };

  const handleScreenshot = async () => {
    if (!ssUrl.trim()) { toast.error('Enter a URL'); return; }
    setSsLoading(true);
    try {
      const data = await getScreenshot(ssUrl);
      if (data.success) {
        setSsResult(data.screenshotUrl);
        toast.success('Screenshot ready!');
      }
    } catch {
      setSsResult(`https://image.thum.io/get/width/1200/crop/800/noanimate/${encodeURIComponent(ssUrl)}`);
    }
    setSsLoading(false);
  };

  const handleTranslate = async () => {
    if (!transText.trim()) { toast.error('Enter text to translate'); return; }
    setTransLoading(true);
    try {
      const data = await translateText(transText, transFrom, transTo);
      if (data.success) {
        setTransResult(data.translated);
        toast.success('Translated!');
      } else {
        toast.error(data.error || 'Translation failed');
      }
    } catch {
      toast.error('Translation service error');
    }
    setTransLoading(false);
  };

  return (
    <section id="tools" className="relative py-24 bg-[#08060f]">
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

      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-magenta-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full glass-card border-cyan-500/20">
            <FiLink className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-medium text-cyan-400 tracking-wide uppercase">
              Utility Tools
            </span>
          </div>
          <h2 className="font-orbitron text-3xl sm:text-4xl font-bold text-white mb-4">
            Extra <span className="gradient-text">Tools</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Handy utilities for your daily needs. All free, no registration.
          </p>
        </motion.div>

        {/* Tool Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex flex-wrap justify-center bg-[#0d0a18] rounded-xl p-1 border border-purple-500/20 gap-1">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTool === tool.id
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/25'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tool.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tool Content */}
        <motion.div
          key={activeTool}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 sm:p-8"
        >
          {/* Shortlink */}
          {activeTool === 'shortlink' && (
            <div className="max-w-xl mx-auto">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FiLink className="w-5 h-5 text-cyan-400" />
                URL Shortener
              </h3>
              <div className="relative mb-4">
                <input
                  type="url"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleShorten()}
                  placeholder="Paste long URL..."
                  className="w-full pl-4 pr-24 py-3 bg-[#0d0a18] border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
                />
                <button
                  onClick={handleShorten}
                  disabled={shortLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-500 transition-all disabled:opacity-50"
                >
                  {shortLoading ? <FiLoader className="w-4 h-4 animate-spin" /> : 'Shorten'}
                </button>
              </div>
              {shortUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 bg-[#0d0a18] rounded-xl border border-cyan-500/20"
                >
                  <span className="flex-1 text-cyan-400 text-sm truncate">{shortUrl}</span>
                  <button
                    onClick={() => handleCopy(shortUrl)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    {copied ? <FiCheck className="w-4 h-4 text-green-400" /> : <FiCopy className="w-4 h-4" />}
                  </button>
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <FiExternalLink className="w-4 h-4" />
                  </a>
                </motion.div>
              )}
            </div>
          )}

          {/* QR Code */}
          {activeTool === 'qr' && (
            <div className="max-w-xl mx-auto text-center">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 justify-center">
                <FiGrid className="w-5 h-5 text-cyan-400" />
                QR Code Generator
              </h3>
              <input
                type="text"
                value={qrUrl}
                onChange={(e) => setQrUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateQR()}
                placeholder="Enter text or URL..."
                className="w-full px-4 py-3 mb-4 bg-[#0d0a18] border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
              />
              <button
                onClick={handleGenerateQR}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-medium rounded-xl hover:from-purple-500 hover:to-cyan-400 transition-all mb-6"
              >
                Generate QR Code
              </button>
              {qrValue && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-block p-6 bg-white rounded-2xl"
                >
                  <QRCode value={qrValue} size={200} />
                </motion.div>
              )}
            </div>
          )}

          {/* Screenshot */}
          {activeTool === 'screenshot' && (
            <div className="max-w-3xl mx-auto">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FiCamera className="w-5 h-5 text-cyan-400" />
                Website Screenshot
              </h3>
              <div className="relative mb-6">
                <input
                  type="url"
                  value={ssUrl}
                  onChange={(e) => setSsUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleScreenshot()}
                  placeholder="Enter website URL..."
                  className="w-full pl-4 pr-24 py-3 bg-[#0d0a18] border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
                />
                <button
                  onClick={handleScreenshot}
                  disabled={ssLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-500 transition-all disabled:opacity-50"
                >
                  {ssLoading ? <FiLoader className="w-4 h-4 animate-spin" /> : 'Capture'}
                </button>
              </div>
              {ssResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl overflow-hidden border border-purple-500/20"
                >
                  <img
                    src={ssResult}
                    alt="Screenshot"
                    className="w-full h-auto"
                  />
                  <div className="p-3 bg-[#0d0a18] flex justify-end">
                    <a
                      href={ssResult}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <FiDownload className="w-4 h-4" />
                      Open Full Size
                    </a>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Translate */}
          {activeTool === 'translate' && (
            <div className="max-w-xl mx-auto">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FiType className="w-5 h-5 text-cyan-400" />
                Translator
              </h3>
              <div className="flex gap-3 mb-4">
                <select
                  value={transFrom}
                  onChange={(e) => setTransFrom(e.target.value)}
                  className="px-3 py-2 bg-[#0d0a18] border border-purple-500/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500/50"
                >
                  <option value="auto">Auto</option>
                  <option value="en">English</option>
                  <option value="id">Indonesian</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ja">Japanese</option>
                  <option value="ko">Korean</option>
                  <option value="zh">Chinese</option>
                  <option value="ar">Arabic</option>
                </select>
                <span className="flex items-center text-gray-500">→</span>
                <select
                  value={transTo}
                  onChange={(e) => setTransTo(e.target.value)}
                  className="px-3 py-2 bg-[#0d0a18] border border-purple-500/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500/50"
                >
                  <option value="en">English</option>
                  <option value="id">Indonesian</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ja">Japanese</option>
                  <option value="ko">Korean</option>
                  <option value="zh">Chinese</option>
                  <option value="ar">Arabic</option>
                </select>
              </div>
              <textarea
                value={transText}
                onChange={(e) => setTransText(e.target.value)}
                placeholder="Enter text to translate..."
                rows={4}
                className="w-full px-4 py-3 mb-4 bg-[#0d0a18] border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all resize-none"
              />
              <button
                onClick={handleTranslate}
                disabled={transLoading}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-medium rounded-xl hover:from-purple-500 hover:to-cyan-400 transition-all disabled:opacity-50 mb-4"
              >
                {transLoading ? <FiLoader className="w-4 h-4 animate-spin inline mr-2" /> : null}
                Translate
              </button>
              {transResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-[#0d0a18] rounded-xl border border-cyan-500/20"
                >
                  <p className="text-cyan-300 text-sm">{transResult}</p>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
