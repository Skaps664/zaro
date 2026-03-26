"use client"

import { motion } from "framer-motion"

interface AnimatedTextProps {
  text: string
  delay?: number
}

export function AnimatedText({ text, delay = 0 }: AnimatedTextProps) {
  const words = text.split(" ")

  return (
    <span>
      {words.map((word, wordIndex) => {
        const previousChars = words.slice(0, wordIndex).join(" ").length

        return (
          <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap" style={{ whiteSpace: "nowrap" }}>
            {word.split("").map((char, charIndex) => {
              const index = previousChars + (wordIndex > 0 ? 1 : 0) + charIndex

              return (
                <motion.span
                  key={`${word}-${wordIndex}-${char}-${charIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: delay + index * 0.03,
                    ease: [0.21, 0.47, 0.32, 0.98],
                  }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              )
            })}
            {wordIndex < words.length - 1 ? "\u00A0" : ""}
          </span>
        )
      })}
    </span>
  )
}
