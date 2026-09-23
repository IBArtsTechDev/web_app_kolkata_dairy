export function LocalMotionPictures() {
  return (
    <section className="w-full bg-[#0a0a0a] py-3 sm:py-5 sm:hidden" aria-label="Local motion pictures">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-base font-bold text-white mb-3">Showcasing local motion pictures</h2>
        
        <div className="relative rounded-2xl overflow-hidden bg-[#141414] border border-neutral-800">
          <div className="relative h-32 w-full">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-90" />
            
            <div className="absolute top-2 right-2">
              <span className="w-6 h-6 rounded-full bg-black/50 backdrop-blur flex items-center justify-center border border-white/10">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </span>
            </div>
            
            {/* Fake title graphic */}
            <div className="absolute top-4 left-4">
              <span className="text-3xl font-black text-white/90 uppercase tracking-tighter font-['Impact',sans-serif]">HISTORY</span>
              <span className="block text-[8px] text-red-500 font-bold uppercase tracking-widest mt-0.5">Photo Effect</span>
            </div>
          </div>
          
          <div className="p-3">
            <h3 className="text-[13px] font-bold text-white mb-1">History Photo Effect</h3>
            <p className="text-[10px] text-neutral-500 mb-2">Sun, 27 May • 08:30 • Kalighat</p>
            <p className="text-[11px] font-bold text-white">₹99 Onwards</p>
          </div>
        </div>
      </div>
    </section>
  )
}
