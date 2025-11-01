interface MacroRingProps {
  label: string;
  current: number;
  goal: number;
  color: string;
  unit: string;
}

export function MacroRing({ label, current, goal, color, unit }: MacroRingProps) {
  const percent = Math.min((current / goal) * 100, 100);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="macro-ring">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="#2a2a2a"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
        <text x="60" y="55" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="bold">
          {current}
        </text>
        <text x="60" y="72" textAnchor="middle" fill="#999" fontSize="12">
          / {goal}{unit}
        </text>
      </svg>
      <p className="macro-label">{label}</p>
    </div>
  );
}
