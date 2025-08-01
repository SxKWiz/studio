'use server';

import { suggestChartPatterns, SuggestChartPatternsInput, SuggestChartPatternsOutput } from '@/ai/flows/suggest-chart-patterns';

function generateMockChartData(): string {
  let csv = 'Date,Open,High,Low,Close\n';
  const today = new Date();
  for (let i = 90; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const open = 150 + Math.random() * 20 - 10;
    const close = open + Math.random() * 10 - 5;
    const high = Math.max(open, close) + Math.random() * 5;
    const low = Math.min(open, close) - Math.random() * 5;
    csv += `${date.toISOString().split('T')[0]},${open.toFixed(2)},${high.toFixed(2)},${low.toFixed(2)},${close.toFixed(2)}\n`;
  }
  return csv;
}

export async function getPatternAnalysis(
  ticker: string,
  indicators: string[]
): Promise<SuggestChartPatternsOutput> {
  try {
    const input: SuggestChartPatternsInput = {
      ticker,
      indicators: indicators.join(', '),
      chartData: generateMockChartData(), // Using mock data as we can't extract from widget
    };
    const result = await suggestChartPatterns(input);
    return result;
  } catch (error) {
    console.error("AI flow 'suggestChartPatterns' failed:", error);
    throw new Error('Failed to get analysis from AI service.');
  }
}
