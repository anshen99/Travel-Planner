'use client'

import { motion } from 'framer-motion'
import { FaMapMarkedAlt, FaCalendarAlt, FaMoneyBillWave, FaSuitcase } from 'react-icons/fa'

const features = [
  {
    icon: <FaMapMarkedAlt className="w-8 h-8" />,
    title: "Smart Itinerary",
    description: "Create detailed day-by-day plans with our intelligent itinerary builder"
  },
  {
    icon: <FaCalendarAlt className="w-8 h-8" />,
    title: "Trip Management",
    description: "Keep all your travel plans organized in one place"
  },
  {
    icon: <FaMoneyBillWave className="w-8 h-8" />,
    title: "Budget Tracking",
    description: "Monitor your expenses and stay within your travel budget"
  },
  {
    icon: <FaSuitcase className="w-8 h-8" />,
    title: "Packing Lists",
    description: "Never forget essential items with our smart packing lists"
  }
]

export default function Features() {
  return (
    <section className="py-20  bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Plan Your Trip
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our comprehensive suite of tools makes travel planning effortless and enjoyable
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 