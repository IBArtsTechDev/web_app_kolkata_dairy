import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export function Preloader() {
  const [isMounted, setIsMounted] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)
  const textRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = 'hidden'

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = 'unset'
        setIsMounted(false)
      }
    })

    // Animation sequence
    // 1. Fade in the logos slightly scaling down
    tl.fromTo(logoRef.current, 
      { opacity: 0, scale: 1.2, y: 20, filter: 'blur(10px)' },
      { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out' }
    )
    .fromTo(textRef.current,
      { opacity: 0, y: 15, filter: 'blur(5px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out' },
      "-=0.4" // Overlap with previous animation
    )
    
    // 2. Pause to hold the logo on screen for a moment
    .to({}, { duration: 0.4 })
    
    // 3. Stagger animate them out
    .to([logoRef.current, textRef.current], {
      y: -30,
      opacity: 0,
      filter: 'blur(10px)',
      duration: 0.4,
      stagger: 0.05,
      ease: 'power3.in'
    })
    
    // 4. Slide the whole container up to reveal the site seamlessly
    .to(containerRef.current, {
      yPercent: -100,
      duration: 0.7,
      ease: 'expo.inOut'
    }, "-=0.2") // Start sliding up slightly before logos are completely gone

    return () => {
      tl.kill()
      document.body.style.overflow = 'unset'
    }
  }, [])

  if (!isMounted) return null

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-[#050507] flex flex-col items-center justify-center select-none overflow-hidden"
    >
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#4a1020] rounded-full blur-[120px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#1a0b1c] rounded-full blur-[120px] opacity-40 pointer-events-none" />
      
      <div className="relative flex flex-col items-center z-10">
        <img 
          ref={logoRef}
          src="/logo.png" 
          alt="Kolkata Diary" 
          className="w-24 h-24 sm:w-28 sm:h-28 object-contain mb-4 opacity-0" 
        />
        <img 
          ref={textRef}
          src="/logo_text.png" 
          alt="Kolkata Diary Text" 
          className="h-8 sm:h-10 w-auto object-contain opacity-0" 
        />
        
        {/* Subtle glow effect behind the logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#FF2E4D] rounded-full blur-[100px] opacity-20 pointer-events-none" />
      </div>
    </div>
  )
}
