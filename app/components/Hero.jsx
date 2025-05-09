'use client'

import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import { OrbitControls } from '@react-three/drei'
import Globe from './Globe'

export default function Hero() {
  return (
    <section className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-start p-0 m-0">
      {/* 3D Globe at the top */}
      <div className="w-full flex justify-center items-center" style={{height: '50vh'}}>
        <div className="w-full h-full" style={{maxWidth: '600px', aspectRatio: '1/1'}}>
          <Canvas camera={{ position: [0, 0, 2.5] }} style={{width: '100%', height: '100%'}}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <pointLight position={[-10, -10, -10]} intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <Globe />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.5}
            />
          </Canvas>
        </div>
      </div>
      {/* Content below the globe */}
      <div className="w-full flex flex-col items-center justify-center text-center px-4" style={{marginTop: '-2rem'}}>
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
          >
            Plan Your Next
            <span className="text-primary block mt-2">Adventure</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
          >
            Discover the world with our comprehensive travel planning tools.
            From dream destinations to detailed itineraries, we've got you covered.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="px-8 py-3 bg-primary text-white rounded-full hover:bg-blue-600 transition-colors">
              Get Started
            </button>
            <button className="px-8 py-3 border-2 border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-colors">
              Learn More
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 