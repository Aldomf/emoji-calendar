interface ProgressDonutProps {
  healthyPct: number; // e.g. 70
  unhealthyPct: number; // e.g. 30
  size?: number; // optional size
  strokeWidth?: number;
}

export default function ProgressDonut({
  healthyPct,
  unhealthyPct,
  size = 150,
  strokeWidth = 20,
}: ProgressDonutProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const healthyLength = (circumference * healthyPct) / 100;
  const unhealthyLength = (circumference * unhealthyPct) / 100;

  // Emoji logic
  let moodEmoji = "😐"; // default neutral

  if (healthyPct >= 95) moodEmoji = "❤️";
  else if (healthyPct >= 90) moodEmoji = "🤩";
  else if (healthyPct >= 80) moodEmoji = "😁";
  else if (healthyPct >= 70) moodEmoji = "🙂";
  else if (healthyPct >= 60) moodEmoji = "😮‍💨";
  else if (healthyPct >= 50) moodEmoji = "😐";
  else if (healthyPct >= 40) moodEmoji = "😟";
  else if (healthyPct >= 30) moodEmoji = "😧";
  else if (healthyPct >= 20) moodEmoji = "😨";
  else if (healthyPct >= 10) moodEmoji = "😱";
  else moodEmoji = "💀";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke="#ddd"
        strokeWidth={strokeWidth}
      />

      {/* Healthy segment */}
      {healthyPct > 0 && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="green"
          strokeWidth={strokeWidth}
          strokeDasharray={`${healthyLength} ${circumference - healthyLength}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      )}

      {/* Unhealthy segment */}
      {unhealthyPct > 0 && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="red"
          strokeWidth={strokeWidth}
          strokeDasharray={`${unhealthyLength} ${
            circumference - unhealthyLength
          }`}
          strokeDashoffset={-healthyLength}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      )}

      {/* Emoji in the center */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize={size * 0.4}
      >
        {moodEmoji}
      </text>
    </svg>
  );
}
