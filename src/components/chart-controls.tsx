"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Wand2, Settings2, LoaderCircle } from 'lucide-react';
import type { ChartStyle } from '@/types/chart';

interface ChartControlsProps {
  ticker: string;
  setTicker: (ticker: string) => void;
  chartStyle: ChartStyle;
  setChartStyle: (style: ChartStyle) => void;
  indicators: Record<string, boolean>;
  setIndicators: (indicators: Record<string, boolean>) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

// Validate ticker symbol format
const isValidTicker = (ticker: string): boolean => {
  if (!ticker || ticker.length === 0) return false;
  // Allow alphanumeric characters, dots, and hyphens (common in international markets)
  const tickerRegex = /^[A-Z0-9.-]{1,10}$/;
  return tickerRegex.test(ticker.toUpperCase());
};

export function ChartControls({
  ticker,
  setTicker,
  chartStyle,
  setChartStyle,
  indicators,
  setIndicators,
  onAnalyze,
  isAnalyzing,
}: ChartControlsProps) {
  const handleIndicatorChange = (indicator: string) => {
    setIndicators({
      ...indicators,
      [indicator]: !indicators[indicator],
    });
  };

  const handleTickerChange = (newTicker: string) => {
    const upperTicker = newTicker.toUpperCase();
    if (isValidTicker(upperTicker) || upperTicker === '') {
      setTicker(upperTicker);
    }
  };

  const handleTickerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('ticker') as HTMLInputElement;
    const newTicker = input.value.toUpperCase().trim();
    
    if (isValidTicker(newTicker)) {
      setTicker(newTicker);
    } else if (newTicker === '') {
      // Reset to default if empty
      setTicker('AAPL');
      input.value = 'AAPL';
    } else {
      // Reset input to current valid ticker if invalid
      input.value = ticker;
    }
  };

  return (
    <>
      <form
        className="w-32 sm:w-32 ticker-input"
        onSubmit={handleTickerSubmit}
      >
        <Input
          name="ticker"
          defaultValue={ticker}
          placeholder="Ticker"
          className={`h-9 input-touch focus-enhanced ${!isValidTicker(ticker) && ticker !== '' ? 'border-red-500' : ''}`}
          onBlur={(e) => {
            const newTicker = e.target.value.toUpperCase().trim();
            if (isValidTicker(newTicker)) {
              setTicker(newTicker);
            } else if (newTicker === '') {
              setTicker('AAPL');
              e.target.value = 'AAPL';
            } else {
              e.target.value = ticker;
            }
          }}
          onChange={(e) => {
            // Allow typing but show visual feedback for invalid symbols
            const value = e.target.value.toUpperCase();
            e.target.value = value;
          }}
          maxLength={10}
          title="Enter a valid ticker symbol (1-10 characters, letters, numbers, dots, and hyphens only)"
        />
      </form>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 btn-touch focus-enhanced"
            data-testid="chart-settings-trigger"
          >
            <Settings2 className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Chart Settings</span>
            <span className="sm:hidden">Settings</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 analysis-sheet">
          <DropdownMenuLabel>Chart Type</DropdownMenuLabel>
          <Select
            value={String(chartStyle)}
            onValueChange={(val) => setChartStyle(Number(val) as ChartStyle)}
          >
            <SelectTrigger className="w-[calc(100%-1rem)] mx-auto h-9 mb-2 focus-enhanced">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Bars</SelectItem>
              <SelectItem value="2">Candlestick</SelectItem>
              <SelectItem value="3">Line</SelectItem>
            </SelectContent>
          </Select>
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Indicators</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-h-48 overflow-y-auto mobile-scroll">
            {Object.keys(indicators).map((indicator) => (
              <DropdownMenuCheckboxItem
                key={indicator}
                checked={indicators[indicator]}
                onCheckedChange={() => handleIndicatorChange(indicator)}
                className="focus-enhanced"
              >
                {indicator}
              </DropdownMenuCheckboxItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button 
        onClick={onAnalyze} 
        disabled={isAnalyzing || !isValidTicker(ticker)} 
        size="sm" 
        className="h-9 btn-touch focus-enhanced"
        title={!isValidTicker(ticker) ? "Please enter a valid ticker symbol" : ""}
      >
        {isAnalyzing ? (
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Wand2 className="mr-2 h-4 w-4" />
        )}
        <span className="hidden sm:inline">Analyze Patterns</span>
        <span className="sm:hidden">Analyze</span>
      </Button>
    </>
  );
}
