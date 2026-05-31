import { FiDownload, FiGithub, FiHeart } from 'react-icons/fi';

const footerLinks = {
  Platforms: ['YouTube', 'TikTok', 'Instagram', 'Twitter/X', 'SoundCloud', 'GitHub'],
  Tools: ['URL Shortener', 'QR Generator', 'Screenshot', 'Translator'],
  Legal: ['Terms of Service', 'Privacy Policy', 'DMCA'],
};

export default function Footer() {
  return (
    <footer className="relative bg-[#05040a] border-t border-purple-500/10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2 mb-4">
              <FiDownload className="w-6 h-6 text-purple-400" />
              <span className="font-orbitron text-xl font-bold gradient-text tracking-wider">
                KyyDL
              </span>
            </a>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-sm">
              The ultimate free all-in-one downloader. Download videos, audio, and images
              from 17+ platforms with zero ads and no registration.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-[#0d0a18] border border-purple-500/20 rounded-lg text-gray-400 hover:text-white hover:border-purple-500/40 transition-all"
              >
                <FiGithub className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-orbitron text-sm font-semibold text-white mb-4 tracking-wide">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <span className="text-sm text-gray-500 hover:text-purple-300 transition-colors cursor-default">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-purple-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            &copy; 2026 KyyDL. All rights reserved.
          </p>
          <p className="text-sm text-gray-600 flex items-center gap-1.5">
            Made with <FiHeart className="w-3.5 h-3.5 text-magenta-500 fill-magenta-500" /> by KyyDL Team
          </p>
        </div>
      </div>
    </footer>
  );
}
