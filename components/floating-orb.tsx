interface FloatingOrbProps {
  size: number
  color: string
  top: string
  left: string
  animationDelay: string
}

export default function FloatingOrb({ size, color, top, left, animationDelay }: FloatingOrbProps) {
  return (
    <div
      className={`absolute rounded-full blur-xl opacity-20 animate-float-slow pointer-events-none`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        top,
        left,
        animationDelay,
      }}
    />
  )
}
