import { useRef } from 'react';

const destinations = [
  { name: 'Chiang Mai', tags: 'Nature \u2022 Culture', rating: '4.8' },
  { name: 'Pai', tags: 'Mountains \u2022 Relax', rating: '4.7' },
  { name: 'Chiang Rai', tags: 'Temples \u2022 Art', rating: '4.6' },
  { name: 'Sukhothai', tags: 'History \u2022 Ruins', rating: '4.5' },
];

export default function InspirationSection() {
  const scrollRef = useRef(null);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-brand-700">Inspiration For Your Next Trip</h2>
        <button
          onClick={scrollRight}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-colors shadow-sm"
        >
          <span className="text-[#4A4A3A] text-lg font-bold">&gt;</span>
        </button>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollbarWidth: 'none' }}
      >
        {destinations.map((d) => (
          <div
            key={d.name}
            className="flex-shrink-0 w-64 bg-white rounded-[14px] border border-gray-200 overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-shadow"
          >
            <div className="w-full h-40 bg-gradient-to-t from-black/65 to-transparent relative flex items-center justify-center">
              <div className="w-full h-full bg-gray-200 absolute inset-0 -z-10 flex items-center justify-center">
                <span className="text-gray-400 text-3xl font-light">&times;</span>
              </div>
              <span className="absolute bottom-2 right-2 flex items-center gap-1 bg-[rgba(0,0,0,0.35)] text-xs font-semibold text-white px-2 py-0.5 rounded-full">
                <span className="text-[#F5C842]">&#9733;</span>
                {d.rating}
              </span>
            </div>
            <div className="p-3">
              <h3 className="font-bold text-brand-700">{d.name}</h3>
              <span className="text-xs text-muted">{d.tags}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
