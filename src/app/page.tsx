
'use client';

import { useState } from 'react';
import { ChartGlanceLogo } from '@/components/chart-glance-logo';
import { ChartControls } from '@/components/chart-controls';
import { TradingViewWidget } from '@/components/trading-view-widget';
import { PatternAnalysisSheet } from '@/components/pattern-analysis-sheet';
import { getPatternAnalysis } from '@/app/actions';
import type { SuggestChartPatternsOutput } from '@/ai/flows/suggest-chart-patterns';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { LoaderCircle } from 'lucide-react';
import type { ChartStyle, Indicator } from '@/types/chart';
import { ThemeToggle } from '@/components/theme-toggle';
import { useTheme } from 'next-themes';

export default function Home() {
  const [ticker, setTicker] = useLocalStorage('ticker', 'AAPL');
  const [chartStyle, setChartStyle] = useLocalStorage<ChartStyle>('chartStyle', 2); // 2 is Candlestick
  const [indicators, setIndicators] = useLocalStorage<Record<string, boolean>>('indicators', {
    'Moving Average': true,
    'Relative Strength Index': false,
    'Bollinger Bands': false,
  });

  const [analysis, setAnalysis] = useState<SuggestChartPatternsOutput | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { theme } = useTheme();

  const { toast } = useToast();

  const handleAnalyze = async () => {
    setIsAnalysisLoading(true);
    try {
      const selectedIndicators = Object.entries(indicators)
        .filter(([, value]) => value)
        .map(([key]) => key);

      const result = await getPatternAnalysis(ticker, selectedIndicators);
      setAnalysis(result);
      setIsSheetOpen(true);
    } catch (error) {
      console.error('Failed to get pattern analysis:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not retrieve AI pattern analysis. Please try again later.',
      });
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  const activeIndicators = Object.entries(indicators)
    .filter(([, value]) => value)
    .map(([key]) => key as Indicator);

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <ChartGlanceLogo />
          <h1 className="text-xl font-semibold text-foreground">Chart Glance</h1>
        </div>
        <div className="flex items-center gap-2">
          <ChartControls
            ticker={ticker}
            setTicker={setTicker}
            chartStyle={chartStyle}
            setChartStyle={setChartStyle}
            indicators={indicators}
            setIndicators={setIndicators}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalysisLoading}
          />
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        {isAnalysisLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 p-4 rounded-lg bg-card shadow-lg">
              <LoaderCircle className="animate-spin" />
              <span className="text-foreground">Analyzing patterns...</span>
            </div>
          </div>
        )}
        <div className="flex-1 h-full w-full">
          <TradingViewWidget
            symbol={ticker}
            style={chartStyle}
            indicators={activeIndicators}
            theme={theme}
          />
        </div>
      </main>
      {analysis && (
        <PatternAnalysisSheet
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          analysis={analysis}
          ticker={ticker}
        />
      )}
    </div>
  );
}
