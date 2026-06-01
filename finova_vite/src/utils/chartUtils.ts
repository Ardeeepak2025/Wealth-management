import type { ChartPoint } from "@/types/stock";

export const profitLossData: ChartPoint[] = [
  { label: "Jan", value: 1200 },
  { label: "Feb", value: 1860 },
  { label: "Mar", value: 960 },
  { label: "Apr", value: 2400 },
  { label: "May", value: 3110 },
];

export function toChartPoints(values: number[], prefix = "D"): ChartPoint[] {
  return values.map((value, index) => ({ label: `${prefix}${index + 1}`, value }));
}

export function makeTrend(base: number): ChartPoint[] {
  return [0.94, 0.98, 1.02, 1, 1.06, 1.1, 1.08].map((factor, index) => ({
    label: `Day ${index + 1}`,
    value: Math.round(base * factor),
  }));
}
