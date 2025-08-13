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
          primary: 'from-blue-600 via-cyan-500 to-teal-400',
          secondary: 'from-blue-500/30 to-cyan-400/30',
          accent: 'from-teal-400/20 to-blue-600/20',
          particles: 'bg-cyan-300/40',
        };
      case 'sunset':
        return {
          primary: 'from-orange-500 via-pink-500 to-purple-600',
          secondary: 'from-yellow-400/30 to-orange-500/30',
          accent: 'from-pink-400/20 to-purple-500/20',
          particles: 'bg-orange-300/40',
        };
      case 'tropical':
        return {
          primary: 'from-green-500 via-emerald-400 to-cyan-400',
          secondary: 'from-lime-400/30 to-green-500/30',
          accent: 'from-emerald-400/20 to-cyan-500/20',
          particles: 'bg-lime-300/40',
        };
      case 'gaming':
        return {
          primary: 'from-purple-600 via-pink-500 to-cyan-400',
          secondary: 'from-purple-500/30 to-pink-400/30',
          accent: 'from-pink-400/20 to-cyan-500/20',
          particles: 'bg-pink-300/40',
        };
      default:
        return {
          primary: 'from-blue-600 via-cyan-500 to-teal-400',
          secondary: 'from-blue-500/30 to-cyan-400/30',
          accent: 'from-teal-400/20 to-blue-600/20',
          particles: 'bg-cyan-300/40',
        };
    }
  };

  const styles = getVariantStyles();
  const intensityMultiplier = intensity === 'low' ? 0.5 : intensity === 'high' ? 1.5 : 1;
  const particleCount = intensity === 'high' ? 20 : intensity === 'medium' ? 12 : 6;

  return (
    <div className="relative overflow-hidden">
      {/* Base gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${styles.primary} opacity-20`} />
      
      {/* Animated wave layers */}
      <div className="absolute inset-0">
        {/* Wave 1 - Main wave */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${styles.secondary} opacity-60`}
          animate={{
            clipPath: [
              "polygon(0 60%, 100% 40%, 100% 100%, 0% 100%)",
              "polygon(0 40%, 100% 60%, 100% 100%, 0% 100%)",
              "polygon(0 50%, 100% 30%, 100% 100%, 0% 100%)",
              "polygon(0 60%, 100% 40%, 100% 100%, 0% 100%)",
            ],
          }}
          transition={{
            duration: 8 * intensityMultiplier,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Wave 2 - Secondary wave */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-l ${styles.accent} opacity-40`}
          animate={{
            clipPath: [
              "polygon(0 70%, 100% 50%, 100% 100%, 0% 100%)",
              "polygon(0 50%, 100% 70%, 100% 100%, 0% 100%)",
              "polygon(0 60%, 100% 40%, 100% 100%, 0% 100%)",
              "polygon(0 70%, 100% 50%, 100% 100%, 0% 100%)",
            ],
          }}
          transition={{
            duration: 12 * intensityMultiplier,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Wave 3 - Top accent wave */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${styles.secondary} opacity-30`}
          animate={{
            clipPath: [
              "polygon(0 0%, 100% 0%, 100% 30%, 0% 20%)",
              "polygon(0 0%, 100% 0%, 100% 20%, 0% 40%)",
              "polygon(0 0%, 100% 0%, 100% 35%, 0% 15%)",
              "polygon(0 0%, 100% 0%, 100% 30%, 0% 20%)",
            ],
          }}
          transition={{
            duration: 10 * intensityMultiplier,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Floating particles - only render on client */}
      {isClient && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: particleCount }).map((_, i) => {
            const randomX = Math.random() * 100;
            const randomY = Math.random() * 100;
            const randomSize = Math.random() * 4 + 2;
            
            return (
              <motion.div
                key={i}
                className={`absolute rounded-full blur-sm ${styles.particles}`}
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
                    `${(randomX + 20) % 100}vw`,
                    `${(randomX + 40) % 100}vw`,
                    `${randomX}vw`,
                  ],
                  y: [
                    `${randomY}vh`,
                    `${(randomY + 15) % 100}vh`,
                    `${(randomY + 30) % 100}vh`,
                    `${randomY}vh`,
                  ],
                  scale: [0.5, 1.5, 0.8, 0.5],
                  opacity: [0.3, 0.8, 0.4, 0.3],
                }}
                transition={{
                  duration: 15 + Math.random() * 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Interactive light effect that follows mouse */}
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)`,
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Additional glow effects for gaming variant */}
      {variant === 'gaming' && (
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"
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
            className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-cyan-500/20 rounded-full blur-2xl"
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