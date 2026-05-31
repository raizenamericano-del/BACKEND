import { motion } from 'framer-motion';
import { FiDownload, FiArrowDown, FiZap } from 'react-icons/fi';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cyberpunk bg-grid-pattern">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs */}
        <motion.div
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-[10%] w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 right-[10%] w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [-10, 30, -10] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-magenta-500/5 rounded-full blur-3xl"
          style={{ background: 'rgba(236, 72, 153, 0.05)' }}
        />

        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-0 left-1/4 w-px h-full bg-purple-500" />
          <div className="absolute top-0 left-2/4 w-px h-full bg-cyan-500" />
          <div className="absolute top-0 left-3/4 w-px h-full bg-magenta-500" />
        </div>

        {/* Scanline effect */}
        <div className="absolute inset-0 overflow-hidden opacity-[0.03] pointer-events-none">
          <motion.div
            animate={{ top: ['-10%', '110%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"
            style={{ boxShadow: '0 0 10px rgba(168, 85, 247, 0.5)' }}
          />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex-1 text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full glass-card border-purple-500/20"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              <span className="text-xs font-medium text-cyan-400 tracking-wide uppercase">
                All Downloader v1.0
              </span>
            </motion.div>

            {/* Heading */}
            <h1 className="font-orbitron text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight mb-6">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="block text-white"
              >
                Download
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="block gradient-text mt-1"
              >
                Everything.
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="block text-white mt-1"
              >
                For Free.
              </motion.span>
            </h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-gray-400 text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              The ultimate all-in-one downloader. YouTube, TikTok, Instagram,
              Twitter, SoundCloud &{' '}
              <span className="text-purple-400 font-semibold">17+ platforms</span>{' '}
              supported. Fast, free, no ads.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap justify-center lg:justify-start gap-6 mb-10"
            >
              {[
                { value: '17+', label: 'Platforms' },
                { value: '100%', label: 'Free' },
                { value: 'No', label: 'Ads' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-orbitron text-2xl font-bold text-white neon-text-purple">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap justify-center lg:justify-start gap-4"
            >
              <a
                href="#downloader"
                className="group flex items-center gap-3 px-8 py-4 text-white font-semibold rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 transition-all duration-300 neon-glow-purple"
              >
                <FiDownload className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Start Downloading
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </a>
              <a
                href="#scraper"
                className="flex items-center gap-3 px-8 py-4 text-gray-300 font-semibold rounded-xl border border-purple-500/30 hover:border-purple-400/50 hover:bg-purple-500/5 transition-all duration-300"
              >
                <FiZap className="w-5 h-5" />
                Explore Tools
              </a>
            </motion.div>
          </motion.div>

          {/* Mascot Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex-1 flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Glow behind mascot */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-cyan-500/20 to-magenta-500/20 blur-3xl rounded-full scale-110" />

              {/* Mascot */}
              <motion.img
                src="/mascot.png"
                alt="KyyDL Mascot"
                className="relative z-10 w-[280px] sm:w-[350px] lg:w-[420px] xl:w-[480px] h-auto drop-shadow-2xl"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Floating particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: ['#a855f7', '#06b6d4', '#ec4899', '#a855f7', '#06b6d4', '#ec4899'][i],
                    left: `${20 + i * 12}%`,
                    top: `${10 + (i % 3) * 25}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0.3, 0.8, 0.3],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 2 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: 'easeInOut',
                  }}
                />
              ))}

              {/* Decorative ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-8 border border-purple-500/10 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-4 border border-cyan-500/10 rounded-full border-dashed"
              />
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.a
            href="#downloader"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-gray-500 hover:text-purple-400 transition-colors"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <FiArrowDown className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
