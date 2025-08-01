
'use client';

import { useState, useRef } from 'react';
import { ChartGlanceLogo } from '@/components/chart-glance-logo';
import { ChartControls } from '@/components/chart-controls';
import { TradingViewWidget } from '@/components/trading-view-widget';
import { PatternAnalysisSheet } from '@/components/pattern-analysis-sheet';
import { ErrorBoundary, ChartErrorBoundary } from '@/components/error-boundary';
import { KeyboardShortcutsHelp } from '@/components/keyboard-shortcuts-help';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { getPatternAnalysis } from '@/app/actions';
import type { SuggestChartPatternsOutput } from '@/ai/flows/suggest-chart-patterns';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { LoaderCircle } from 'lucide-react';
import type { ChartStyle, Indicator } from '@/types/chart';
import { ThemeToggle } from '@/components/theme-toggle';
import { useTheme } from 'next-themes';
import { useAnalysisCache } from '@/hooks/use-analysis-cache';

export default function Home() {
  const [ticker, setTicker] = useLocalStorage('ticker', 'AAPL');
  const [chartStyle, setChartStyle] = useLocalStorage<ChartStyle>('chartStyle', 2); // 2 is Candlestick
  const [indicators, setIndicators] = useLocalStorage<Record<string, boolean>>('indicators', {
    'Moving Average': true,
    'Relative Strength Index': false,
    'Bollinger Bands': false,
    'MACD': false,
    'Stochastic': false,
    'Williams %R': false,
    'Volume': true,
    'Momentum': false,
  });

  const [analysis, setAnalysis] = useState<SuggestChartPatternsOutput | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const tickerInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const { getCachedAnalysis, setCachedAnalysis, isCached } = useAnalysisCache();

  const handleAnalyze = async () => {
    if (isAnalysisLoading) return;
    
    const selectedIndicators = Object.entries(indicators)
      .filter(([, value]) => value)
      .map(([key]) => key);

    // Check cache first
    const cachedResult = getCachedAnalysis(ticker, selectedIndicators);
    if (cachedResult) {
      setAnalysis(cachedResult);
      setIsSheetOpen(true);
      toast({
        title: 'Analysis Loaded',
        description: 'Showing cached analysis result.',
      });
      return;
    }
    
    setIsAnalysisLoading(true);
    try {
      const result = await getPatternAnalysis(ticker, selectedIndicators);
      
      // Cache the result
      setCachedAnalysis(ticker, selectedIndicators, result);
      
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

  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleFocusTicker = () => {
    const tickerInput = document.querySelector('input[name="ticker"]') as HTMLInputElement;
    if (tickerInput) {
      tickerInput.focus();
      tickerInput.select();
    }
  };

  const handleToggleSettings = () => {
    const settingsButton = document.querySelector('[data-testid="chart-settings-trigger"]') as HTMLButtonElement;
    if (settingsButton) {
      settingsButton.click();
    }
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
  };

  // Set up keyboard shortcuts
  const { shortcuts } = useKeyboardShortcuts({
    onAnalyze: handleAnalyze,
    onToggleTheme: handleToggleTheme,
    onFocusTicker: handleFocusTicker,
    onToggleSettings: handleToggleSettings,
    onCloseSheet: handleCloseSheet,
  });

  const activeIndicators = Object.entries(indicators)
    .filter(([, value]) => value)
    .map(([key]) => key as Indicator);

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen bg-background">
        <header className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <ChartGlanceLogo />
            <h1 className="text-xl font-semibold text-foreground hidden sm:block">Chart Glance</h1>
            <h1 className="text-lg font-semibold text-foreground sm:hidden">Chart</h1>
          </div>
          <div className="flex items-center gap-2 header-content">
            <ErrorBoundary>
              <div className="flex flex-wrap gap-2 sm:gap-2 chart-controls-mobile sm:flex-row">
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
              </div>
            </ErrorBoundary>
            <KeyboardShortcutsHelp shortcuts={shortcuts} />
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
          <div className="flex-1 h-full w-full chart-container">
            <ChartErrorBoundary>
              <TradingViewWidget
                symbol={ticker}
                style={chartStyle}
                indicators={activeIndicators}
                theme={theme}
              />
            </ChartErrorBoundary>
          </div>
        </main>
        {analysis && (
          <ErrorBoundary>
            <PatternAnalysisSheet
              open={isSheetOpen}
              onOpenChange={setIsSheetOpen}
              analysis={analysis}
              ticker={ticker}
            />
          </ErrorBoundary>
        )}
      </div>
    </ErrorBoundary>
  );
}
