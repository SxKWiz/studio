'use server';

import { suggestChartPatterns, SuggestChartPatternsInput, SuggestChartPatternsOutput } from '@/ai/flows/suggest-chart-patterns';

// A simple hashing function to create a seed from the ticker symbol
function tickerToSeed(ticker: string): number {
  let hash = 0;
  for (let i = 0; i < ticker.length; i++) {
    const char = ticker.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

// Pseudo-random number generator using a seed
function seededRandom(seed: number) {
  let s = Math.sin(seed) * 10000;
  return s - Math.floor(s);
}

function generateDynamicChartData(ticker: string): string {
  let csv = 'Date,Open,High,Low,Close\n';
  const today = new Date();
  const seed = tickerToSeed(ticker);

  // Base price derived from the ticker to make different stocks have different price ranges
  const basePrice = (Math.abs(seed) % 200) + 50; 
  
  for (let i = 90; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Use a seeded random generator for deterministic "randomness" based on the ticker
    const randomFactor = seededRandom(seed + i);

    const open = basePrice + randomFactor * 20 - 10;
    const close = open + (seededRandom(seed + i + 1) * 10 - 5);
    const high = Math.max(open, close) + (seededRandom(seed + i + 2) * 5);
    const low = Math.min(open, close) - (seededRandom(seed + i + 3) * 5);
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
      chartData: generateDynamicChartData(ticker), // Using dynamic data based on ticker
    };
    const result = await suggestChartPatterns(input);
    return result;
  } catch (error) {
    console.error("AI flow 'suggestChartPatterns' failed:", error);
    throw new Error('Failed to get analysis from AI service.');
  }
}
