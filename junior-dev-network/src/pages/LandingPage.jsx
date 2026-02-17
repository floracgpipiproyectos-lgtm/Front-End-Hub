/**
 * Landing Page
 */
import Hero from '../components/landing/Hero'
import Description from '../components/landing/Description'
import MentorArea from '../components/landing/MentorArea'
import Footer from '../components/layout/Footer'

export default function LandingPage() {
  return (
    <div className="bg-white">
      <Hero />
      <Description />
      <MentorArea />
      <Footer />
    </div>
  )
}
