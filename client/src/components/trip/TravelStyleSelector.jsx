const styles = [
  { value: 'chill', label: 'Chill', emoji: '😎', desc: 'Relaxed stops with low activity intensity' },
  { value: 'foodie', label: 'Foodie', emoji: '🍜', desc: 'Food and dining experiences' },
  { value: 'photographer', label: 'Photographer', emoji: '📸', desc: 'Visually striking locations' },
  { value: 'adventure', label: 'Adventure', emoji: '🏔️', desc: 'Outdoor and high-activity destinations' },
  { value: 'budget', label: 'Budget', emoji: '💰', desc: 'Low-cost or free attractions' },
];

export default function TravelStyleSelector({ value, onChange }) {
  return (
    <div>
      <label className="block font-medium text-sm text-gray-700 mb-2">Travel Style</label>
      <div className="flex gap-2 flex-wrap">
        {styles.map((s) => (
          <button
            key={s.value}
            type="button"
              className={`flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer min-w-[120px] flex-1 transition-all ${
                value === s.value
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-[#E0DED6] bg-white hover:border-gray-300'
              }`}
            onClick={() => onChange(s.value)}
          >
            <span className="text-2xl mb-1">{s.emoji}</span>
            <span className="font-semibold text-sm text-gray-800">{s.label}</span>
            <span className="text-xs text-gray-500 text-center mt-1">{s.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
