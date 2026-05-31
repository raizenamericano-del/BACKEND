import Navbar from '@/components/Navbar';
import Hero from '@/sections/Hero';
import DownloaderHub from '@/sections/DownloaderHub';
import ScraperSection from '@/sections/ScraperSection';
import ToolsSection from '@/sections/ToolsSection';
import Footer from '@/sections/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#08060f] text-white font-inter overflow-x-hidden">
      <Navbar />
      <Hero />
      <DownloaderHub />
      <ScraperSection />
      <ToolsSection />
      <Footer />
    </div>
  );
}
