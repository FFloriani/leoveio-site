'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AnimatedBackgroundProps {
  variant?: 'ocean' | 'sunset' | 'tropical' | 'gaming';
  intensity?: 'low' | 'medium' | 'high';
  children?: React.ReactNode;
}

const AnimatedBackground = ({
  variant = 'ocean',
  intensity = 'medium',
  children
}: AnimatedBackgroundProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getVariantStyles = () => {
    switch (variant) {
      case 'ocean':
        return {
          primary: 'from-blue-400 via-cyan-300 to-teal-200',
          secondary: 'from-blue-300/40 to-cyan-200/40',
          accent: 'from-teal-200/30 to-blue-400/30',
          particles: 'bg-cyan-200/50',
        };
      case 'sunset':
        return {
          primary: 'from-orange-300 via-pink-300 to-purple-400',
          secondary: 'from-yellow-200/40 to-orange-300/40',
          accent: 'from-pink-200/30 to-purple-300/30',
          particles: 'bg-orange-200/50',
        };
      case 'tropical':
        return {
          primary: 'from-emerald-300 via-teal-200 to-cyan-300',
          secondary: 'from-lime-200/40 to-emerald-300/40',
          accent: 'from-teal-200/30 to-cyan-300/30',
          particles: 'bg-lime-200/50',
        };
      case 'gaming':
        return {
          primary: 'from-purple-400 via-pink-300 to-cyan-300',
          secondary: 'from-purple-300/40 to-pink-200/40',
          accent: 'from-pink-200/30 to-cyan-300/30',
          particles: 'bg-pink-200/50',
        };
      default:
        return {
          primary: 'from-blue-400 via-cyan-300 to-teal-200',
          secondary: 'from-blue-300/40 to-cyan-200/40',
          accent: 'from-teal-200/30 to-blue-400/30',
          particles: 'bg-cyan-200/50',
        };
    }
  };

  const styles = getVariantStyles();
  const intensityMultiplier = intensity === 'low' ? 0.5 : intensity === 'high' ? 1.5 : 1;
  const particleCount = intensity === 'high' ? 8 : intensity === 'medium' ? 4 : 2;

  return (
    <div className="relative overflow-hidden">
      {/* Base gradient background - Beach vibe */}
      <div className={`absolute inset-0 bg-gradient-to-br ${styles.primary} opacity-30`} />

      {/* Beach wave layers - More natural and subtle */}
      <div className="absolute inset-0">
        {/* Wave 1 - Subtle ocean movement */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${styles.secondary} opacity-30`}
          animate={{
            clipPath: [
              "polygon(0 85%, 100% 75%, 100% 100%, 0% 100%)",
              "polygon(0 75%, 100% 85%, 100% 100%, 0% 100%)",
              "polygon(0 80%, 100% 70%, 100% 100%, 0% 100%)",
              "polygon(0 85%, 100% 75%, 100% 100%, 0% 100%)",
            ],
          }}
          transition={{
            duration: 20 * intensityMultiplier,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Wave 2 - Very subtle secondary movement */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-l ${styles.accent} opacity-20`}
          animate={{
            clipPath: [
              "polygon(0 90%, 100% 80%, 100% 100%, 0% 100%)",
              "polygon(0 80%, 100% 90%, 100% 100%, 0% 100%)",
              "polygon(0 85%, 100% 75%, 100% 100%, 0% 100%)",
              "polygon(0 90%, 100% 80%, 100% 100%, 0% 100%)",
            ],
          }}
          transition={{
            duration: 25 * intensityMultiplier,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Wave 3 - Minimal top accent */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${styles.secondary} opacity-15`}
          animate={{
            clipPath: [
              "polygon(0 0%, 100% 0%, 100% 15%, 0% 5%)",
              "polygon(0 0%, 100% 0%, 100% 5%, 0% 20%)",
              "polygon(0 0%, 100% 0%, 100% 18%, 0% 3%)",
              "polygon(0 0%, 100% 0%, 100% 15%, 0% 5%)",
            ],
          }}
          transition={{
            duration: 30 * intensityMultiplier,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Floating particles - Very subtle ambient particles */}
      {isClient && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: Math.max(2, particleCount - 1) }).map((_, i) => {
            const randomX = Math.random() * 100;
            const randomY = Math.random() * 100;
            const randomSize = Math.random() * 3 + 2;

            return (
              <motion.div
                key={i}
                className={`absolute rounded-full blur-md ${styles.particles} opacity-20`}
                style={{
                  width: `${randomSize}px`,
                  height: `${randomSize}px`,
                }}
                initial={{
                  x: `${randomX}vw`,
                  y: `${randomY}vh`,
                }}
                animate={{
                  x: [
                    `${randomX}vw`,
                    `${(randomX + 8) % 100}vw`,
                    `${(randomX + 16) % 100}vw`,
                    `${randomX}vw`,
                  ],
                  y: [
                    `${randomY}vh`,
                    `${(randomY + 5) % 100}vh`,
                    `${(randomY + 10) % 100}vh`,
                    `${randomY}vh`,
                  ],
                  scale: [0.9, 1.1, 0.95, 0.9],
                  opacity: [0.1, 0.3, 0.15, 0.1],
                }}
                transition={{
                  duration: 40 + Math.random() * 30,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 5,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Interactive subtle light effect that follows mouse */}
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-8 blur-3xl pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(173,216,230,0.1) 30%, transparent 70%)`,
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Very subtle texture pattern */}
      <div
        className="absolute inset-0 opacity-3"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }}
      />

      {/* Additional subtle glow effects for tropical variant */}
      {variant === 'tropical' && (
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/3 left-1/3 w-40 h-40 bg-emerald-300/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-teal-200/10 rounded-full blur-3xl"
            animate={{
              scale: [1.05, 0.95, 1.05],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>
      )}

      {/* Additional glow effects for gaming variant */}
      {variant === 'gaming' && (
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-cyan-300/20 rounded-full blur-2xl"
            animate={{
              scale: [1.2, 0.8, 1.2],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground; 