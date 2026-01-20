import { DistributionRange, StudentScore } from '../types';

export const EXAM_TOTAL_QUESTIONS = 50;

// Defined based on user request:
// 0-8: No alcanzado
// 9-17: Desarrollo inicial
// 18-26: En desarrollo
// 27-35: Estándar (Inferred)
// 36-43: Sobresaliente (Inferred)
// 44-50: Excelencia (Inferred)
const RANGES_CONFIG = [
  { name: 'No Alcanzado', min: 0, max: 8, color: '#ef4444' }, // Red-500
  { name: 'Desarrollo Inicial', min: 9, max: 17, color: '#f97316' }, // Orange-500
  { name: 'En Desarrollo', min: 18, max: 26, color: '#eab308' }, // Yellow-500
  { name: 'Nivel Estándar', min: 27, max: 35, color: '#22c55e' }, // Green-500
  { name: 'Nivel Avanzado', min: 36, max: 43, color: '#0ea5e9' }, // Sky-500
  { name: 'Excelencia', min: 44, max: 50, color: '#6366f1' }, // Indigo-500
];

export const calculateDistribution = (scores: StudentScore[]): DistributionRange[] => {
  const totalStudents = scores.length;

  return RANGES_CONFIG.map((range) => {
    const count = scores.filter(
      (s) => s.score >= range.min && s.score <= range.max
    ).length;

    return {
      ...range,
      count,
      percentage: totalStudents > 0 ? (count / totalStudents) * 100 : 0,
    };
  });
};

export const parseScoresInput = (input: string): number[] => {
  // Matches numbers separated by newlines, commas, or spaces
  return input
    .split(/[\n,\s]+/)
    .map((val) => parseInt(val.trim(), 10))
    .filter((num) => !isNaN(num) && num >= 0 && num <= EXAM_TOTAL_QUESTIONS);
};
