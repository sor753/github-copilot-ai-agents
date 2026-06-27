import type { Mood } from '../types';

interface MoodBadgeProps {
  mood: Mood;
}

const moodConfig: Record<Mood, { label: string; emoji: string }> = {
  great: { label: '最高', emoji: '😄' },
  good: { label: '良い', emoji: '🙂' },
  neutral: { label: '普通', emoji: '😐' },
  bad: { label: 'いまいち', emoji: '😕' },
  terrible: { label: 'つらい', emoji: '😢' },
};

export const MoodBadge = ({ mood }: MoodBadgeProps) => {
  const config = moodConfig[mood];

  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-accent-soft px-2 py-1 text-sm font-medium text-amber-900">
      <span aria-hidden>{config.emoji}</span>
      <span>{config.label}</span>
    </span>
  );
};

export const MOOD_OPTIONS = (Object.keys(moodConfig) as Mood[]).map((mood) => ({
  value: mood,
  label: `${moodConfig[mood].emoji} ${moodConfig[mood].label}`,
}));
