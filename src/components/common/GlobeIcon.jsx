import globeImg from '../../assets/orbital-globe.png'

export default function GlobeIcon({ className = 'w-20 h-20' }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Soft cyan atmospheric aura */}
      <div className="absolute inset-2 rounded-full bg-cyan-400/25 blur-xl pointer-events-none" />
      {/* 3D Cyan Orbital Earth Globe with Rings & Satellites */}
      <img
        src={globeImg}
        alt="Global Connect Orbital Earth Globe"
        className="w-full h-full object-contain drop-shadow-[0_10px_28px_rgba(56,189,248,0.5)] select-none pointer-events-none transition-transform duration-500 hover:scale-105"
      />
    </div>
  )
}
