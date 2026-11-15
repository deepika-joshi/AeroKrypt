import HeroSection from '../home/HeroSection.jsx'
import ExplorePlatform from '../home/ExplorePlatform.jsx'
import UpcomingEventsSection from '../home/UpcomingEventsSection.jsx'
import HowItWorksSection from '../home/HowItWorksSection.jsx'
import ResearchFocusSection from '../home/ResearchFocusSection.jsx'
import useScrollReveal from '../../hooks/useScrollReveal.js'

export default function Dashboard({ onNavigate }) {
  const containerRef = useScrollReveal({ threshold: 0.08, rootMargin: '0px 0px -40px 0px' })

  const handleExploreScroll = () => {
    const el = document.getElementById('explore-platform')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleLearnScroll = () => {
    const el = document.getElementById('how-it-works')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="aerospace-home-root" ref={containerRef}>
      {/* 2. Hero Section */}
      <HeroSection
        onExploreClick={handleExploreScroll}
        onLearnClick={handleLearnScroll}
      />

      <div className="home-content-stream">
        {/* 3. Explore the Platform — four feature cards */}
        <ExplorePlatform onNavigate={onNavigate} />

        {/* 4. Upcoming Research & Events */}
        <UpcomingEventsSection onNavigate={onNavigate} />

        {/* 5. How It Works — four steps */}
        <HowItWorksSection />

        {/* 6. Our Research Focus — three visual areas */}
        <ResearchFocusSection />
      </div>
    </div>
  )
}
