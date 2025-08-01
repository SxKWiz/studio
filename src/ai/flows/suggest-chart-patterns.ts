'use server';

/**
 * @fileOverview A chart pattern suggestion AI agent.
 *
 * - suggestChartPatterns - A function that suggests chart patterns based on chart data.
 * - SuggestChartPatternsInput - The input type for the suggestChartPatterns function.
 * - SuggestChartPatternsOutput - The return type for the suggestChartPatterns function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestChartPatternsInputSchema = z.object({
  chartData: z
    .string()
    .describe('Chart data, for example candlestick data.'),
  indicators: z
    .string()
    .describe('A list of technical indicators applied to the chart.'),
  ticker: z.string().describe('The ticker symbol of the stock.'),
});
export type SuggestChartPatternsInput = z.infer<typeof SuggestChartPatternsInputSchema>;

const SuggestChartPatternsOutputSchema = z.object({
  patterns: z
    .array(z.string())
    .describe('An array of identified chart patterns.'),
  confidenceLevels: z
    .array(z.number())
    .describe('An array of confidence levels for each identified pattern (0-1).'),
  analysis: z
    .string()
    .describe('An overall analysis of the chart patterns and their potential implications.'),
});
export type SuggestChartPatternsOutput = z.infer<typeof SuggestChartPatternsOutputSchema>;

export async function suggestChartPatterns(input: SuggestChartPatternsInput): Promise<SuggestChartPatternsOutput> {
  return suggestChartPatternsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestChartPatternsPrompt',
  input: {schema: SuggestChartPatternsInputSchema},
  output: {schema: SuggestChartPatternsOutputSchema},
  prompt: `You are an expert financial analyst specializing in chart pattern recognition.

You will analyze the provided chart data and technical indicators to identify potential chart patterns, such as triangles, flags, and head and shoulders.

Based on the identified patterns, you will provide an overall analysis of the potential trading opportunities and risks.

Chart Data: {{{chartData}}}
Indicators: {{{indicators}}}

Analyze the chart for ticker {{{ticker}}} and identify potential chart patterns. Return an array of patterns, and a corresponding array of confidence levels for each pattern. Finally, provide an overall analysis of the identified patterns.

Make sure to return a valid JSON object that matches the output schema. If no patterns are found, return an empty array for patterns and confidenceLevels, and a message saying no patterns were found in the analysis field.
`,
});

const suggestChartPatternsFlow = ai.defineFlow(
  {
    name: 'suggestChartPatternsFlow',
    inputSchema: SuggestChartPatternsInputSchema,
    outputSchema: SuggestChartPatternsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
