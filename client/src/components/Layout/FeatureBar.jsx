const sharedFeatures = [
  { icon: '#', label: 'Plan With Era', desc: 'Smart route planning made simple' },
  { icon: '#', label: 'Discover More', desc: 'Find hidden gems along the way' },
  { icon: '#', label: 'Save & Share', desc: 'Keep more memories and share them' },
  { icon: '#', label: 'Travel Your Way', desc: 'Trip that match your style' },
];

const homeFeatures = [
  { icon: '#', label: 'Smart Route Planning', desc: 'Find the best with amazing place along the way' },
  { icon: '#', label: 'Discover Hidden Gems', desc: 'Explore unique spots you might never find on your own' },
  { icon: '#', label: 'Built Your Itinerary', desc: 'Easily plan, customize, and organize your perfect trip' },
  { icon: '#', label: 'Collect Memories', desc: 'Save your trips and share your adventures' },
];

export default function FeatureBar({ variant = 'shared' }) {
  const features = variant === 'home' ? homeFeatures : sharedFeatures;

  return (
    <div className="bg-[#EEF4E6] py-8 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {features.map((f) => (
          <div key={f.label} className="flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 bg-brand-50 rounded flex items-center justify-center text-brand-500 font-bold text-sm">
              {f.icon === '#' ? <>&#9733;</> : f.icon}
            </div>
            <span className="font-semibold text-sm text-[#2D2D20]">{f.label}</span>
            <span className="text-xs text-muted leading-tight">{f.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
