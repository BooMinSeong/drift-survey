'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function FloatingElements() {
  const [elements, setElements] = useState<Array<{
    id: number
    x: number
    y: number
    size: number
    duration: number
    delay: number
  }>>([])

  // Generate random positions only on client side
  useEffect(() => {
    const generatedElements = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 6,
      duration: 20 + Math.random() * 30,
      delay: Math.random() * 10
    }))
    setElements(generatedElements)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10"
          style={{
            width: element.size,
            height: element.size,
            left: `${element.x}%`,
            top: `${element.y}%`,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, 30, -20, 0],
            opacity: [0.3, 0.8, 0.5, 0.3],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}