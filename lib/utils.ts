import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Priority } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getScoreColor(score: number): string {
  if (score >= 80) return '#22C55E';
  if (score >= 60) return '#60A5FA';
  if (score >= 40) return '#FBBF24';
  return '#F87171';
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent Match';
  if (score >= 65) return 'Strong Match';
  if (score >= 50) return 'Moderate Match';
  if (score >= 35) return 'Weak Match';
  return 'Poor Match';
}

export function getScoreGradient(score: number): string {
  if (score >= 80) return 'from-green-500 to-emerald-400';
  if (score >= 60) return 'from-blue-400 to-cyan-400';
  if (score >= 40) return 'from-amber-400 to-yellow-400';
  return 'from-red-400 to-rose-400';
}

export function getPriorityClass(priority: Priority): string {
  switch (priority) {
    case 'critical': return 'priority-badge-critical';
    case 'high': return 'priority-badge-high';
    case 'medium': return 'priority-badge-medium';
    case 'low': return 'priority-badge-low';
  }
}

export function getPriorityLabel(priority: Priority): string {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    keywords: '🎯',
    format: '📐',
    content: '✍️',
    skills: '⚡',
    experience: '🏆',
  };
  return icons[category] ?? '💡';
}
