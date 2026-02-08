export const CHART_COLORS = [
  "#6366F1", // indigo
  "#22C55E", // green
  "#F59E0B", // amber
  "#EF4444", // red
  "#06B6D4", // cyan
  "#A855F7", // purple
  "#EC4899", // pink
  "#84CC16", // lime
];

export const getChartColors = (count) =>
  CHART_COLORS.slice(0, count);
