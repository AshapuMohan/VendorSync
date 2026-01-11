export default function TrustedUsers() {
  const avatars = [
    { id: 1, src: "https://i.pravatar.cc/100?u=1", alt: "User 1" },
    { id: 2, src: "https://i.pravatar.cc/100?u=2", alt: "User 2" },
    { id: 3, src: "https://i.pravatar.cc/100?u=3", alt: "User 3" },
    { id: 4, src: "https://i.pravatar.cc/100?u=4", alt: "User 4" },
  ]

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 my-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-both">
      {/* Avatar Stack */}
      <div className="flex -space-x-3 overflow-hidden">
        {avatars.map((avatar) => (
          <img
            key={avatar.id}
            className="inline-block h-10 w-10 rounded-full ring-2 ring-[#030712] object-cover transition-transform hover:scale-100 hover:z-10 cursor-pointer"
            src={avatar.src}
            alt={avatar.alt}
          />
        ))}
        {/* The "+ more" circle */}
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-800 ring-2 ring-[#030712] text-[10px] font-bold text-white">
          5k+
        </div>
      </div>

      {/* Social Proof Text */}
      <div className="flex flex-col items-center sm:items-start">
        <div className="flex gap-0.5 mb-1">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-3 h-3 text-yellow-500 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <p className="text-xs sm:text-sm text-slate-400 font-medium">
          Trusted by <span className="text-white">5,000+</span> procurement leads worldwide
        </p>
      </div>
    </div>
  )
}