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

  return (
    <>
      <form
        className="w-32"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const input = form.elements.namedItem('ticker') as HTMLInputElement;
          setTicker(input.value.toUpperCase());
        }}
      >
        <Input
          name="ticker"
          defaultValue={ticker}
          placeholder="Ticker"
          className="h-9"
          onBlur={(e) => setTicker(e.target.value.toUpperCase())}
        />
      </form>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            <Settings2 className="mr-2 h-4 w-4" />
            <span>Chart Settings</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Chart Type</DropdownMenuLabel>
          <Select
            value={String(chartStyle)}
            onValueChange={(val) => setChartStyle(Number(val) as ChartStyle)}
          >
            <SelectTrigger className="w-[calc(100%-1rem)] mx-auto h-9 mb-2">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">Candlestick</SelectItem>
              <SelectItem value="3">Line</SelectItem>
            </SelectContent>
          </Select>
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Indicators</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {Object.keys(indicators).map((indicator) => (
            <DropdownMenuCheckboxItem
              key={indicator}
              checked={indicators[indicator]}
              onCheckedChange={() => handleIndicatorChange(indicator)}
            >
              {indicator}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button onClick={onAnalyze} disabled={isAnalyzing} size="sm" className="h-9">
        {isAnalyzing ? (
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Wand2 className="mr-2 h-4 w-4" />
        )}
        Analyze Patterns
      </Button>
    </>
  );
}
