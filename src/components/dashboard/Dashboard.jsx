import HeroSection from '../home/HeroSection.jsx'
import AboutAeroKrypt from '../home/AboutAeroKrypt.jsx'
import ExplorePlatform from '../home/ExplorePlatform.jsx'
import MarsMoonExploration from '../home/MarsMoonExploration.jsx'
import LiveEnvironmentSection from '../home/LiveEnvironmentSection.jsx'
import SimulationPreviewSection from '../home/SimulationPreviewSection.jsx'
import UpcomingEventsSection from '../home/UpcomingEventsSection.jsx'
import OurTeamSection from '../home/OurTeamSection.jsx'
import useScrollReveal from '../../hooks/useScrollReveal.js'

export default function Dashboard({ onNavigate }) {
  const containerRef = useScrollReveal({ threshold: 0.06, rootMargin: '0px 0px -40px 0px' })

  const handleExploreScroll = () => {
    const el = document.getElementById('explore-platform')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleLearnScroll = () => {
    const el = document.getElementById('about-aerokrypt') || document.getElementById('how-it-works')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleMarsFocus = () => {
    const el = document.getElementById('mars-moon-exploration')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleMoonFocus = () => {
    const el = document.getElementById('mars-moon-exploration')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="aerospace-home-root aerospace-landing-redesign" ref={containerRef}>
      {/* 1. Cinematic Hero Section with Animated Mars & Moon */}
      <HeroSection
        onExploreClick={handleExploreScroll}
        onLearnClick={handleLearnScroll}
        onMarsClick={handleMarsFocus}
        onMoonClick={handleMoonFocus}
      />

      <div className="home-content-stream">
        {/* 2. About AeroKrypt: Understanding Worlds Beyond Our Own & How It Works */}
        <AboutAeroKrypt />

        {/* 3. Explore the Platform: 4 Large Feature Cards */}
        <ExplorePlatform onNavigate={onNavigate} />

        {/* 4. Mars and Moon Exploration: Two Worlds. Endless Discoveries. & Our Research Focus */}
        <MarsMoonExploration onNavigate={onNavigate} />

        {/* 5. Live Environment Section: Understand Planetary Environments (Temperature, Pressure, Humidity, Oxygen) */}
        <LiveEnvironmentSection />

        {/* 6. Mars & Moon Simulation Preview: Step Into Another World */}
        <SimulationPreviewSection onNavigate={onNavigate} />

        {/* 7. Upcoming Planetary Research & Conferences */}
        <UpcomingEventsSection onNavigate={onNavigate} />

        {/* 8. Our Team: The Minds Behind AeroKrypt */}
        <OurTeamSection />
      </div>
    </div>
  )
}
