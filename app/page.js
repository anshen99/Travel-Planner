import Link from 'next/link'
import Hero from './components/Hero'
import Features from './components/Features'

export default function Home() {
  return (
    <main className="h-full w-full">
      <Hero />
      <Features />
    </main>
  )
} 