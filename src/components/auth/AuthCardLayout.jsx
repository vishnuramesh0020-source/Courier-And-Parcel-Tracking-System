import loginBg from '../../assets/login-bg.jpg'

export default function AuthCardLayout({ children }) {
  return (
    <div className="relative w-screen min-h-screen h-screen overflow-x-hidden overflow-y-auto bg-[#0d0922] flex items-center justify-center lg:justify-end select-none">
      {/* Fullscreen High-Clarity Background Image */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src={loginBg}
          alt="Global Connect 3D Digital Logistics Network"
          className="w-full h-full object-cover object-left md:object-center"
          style={{ imageRendering: 'high-quality' }}
        />
        {/* Subtle right-side atmospheric gradient to ensure clear text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0922]/40 via-transparent to-[#0d0922]/70 lg:bg-gradient-to-r lg:from-transparent lg:via-[#0d0922]/20 lg:to-[#0d0922]/75 pointer-events-none" />
      </div>

      {/* Floating Form without any card background, border, or shadow */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center lg:justify-end px-4 sm:px-8 lg:pr-16 xl:pr-28 py-10">
        <div className="w-full max-w-[350px] sm:max-w-[370px]">
          {children}
        </div>
      </div>
    </div>
  )
}
