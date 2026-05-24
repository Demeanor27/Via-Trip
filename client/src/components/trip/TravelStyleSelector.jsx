const styles = [
  { value: 'chill', label: 'Chill', emoji: '😎', desc: 'Relaxed stops with low activity intensity' },
  { value: 'foodie', label: 'Foodie', emoji: '🍜', desc: 'Food and dining experiences' },
  { value: 'photographer', label: 'Photographer', emoji: '📸', desc: 'Visually striking locations' },
  { value: 'adventure', label: 'Adventure', emoji: '🏔️', desc: 'Outdoor and high-activity destinations' },
  { value: 'budget', label: 'Budget', emoji: '💰', desc: 'Low-cost or free attractions' },
];

export default function TravelStyleSelector({ value, onChange }) {
  return (
    <div className="travel-style-selector">
      <label>Travel Style</label>
      <div className="style-options">
        {styles.map((s) => (
          <button
            key={s.value}
            type="button"
            className={`style-card ${value === s.value ? 'selected' : ''}`}
            onClick={() => onChange(s.value)}
          >
            <span className="style-emoji">{s.emoji}</span>
            <span className="style-label">{s.label}</span>
            <span className="style-desc">{s.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
