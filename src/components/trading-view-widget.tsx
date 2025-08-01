"use client";

import React, { useEffect, useRef, memo } from 'react';
import type { ChartStyle, Indicator } from '@/types/chart';

interface TradingViewWidgetProps {
  symbol: string;
  style: ChartStyle;
  indicators: Indicator[];
  theme?: string;
}

const indicatorMap: Record<Indicator, string> = {
  'Moving Average': 'MASimple@tv-basicstudies',
  'Relative Strength Index': 'RSI@tv-basicstudies',
  'Bollinger Bands': 'BollingerBands@tv-basicstudies',
};

export const TradingViewWidget: React.FC<TradingViewWidgetProps> = memo(function TradingViewWidget({
  symbol,
  style,
  indicators,
  theme,
}) {
  const container = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any | null>(null);
  const isScriptReady = useRef(false);

  useEffect(() => {
    const createWidget = () => {
      if (container.current && 'TradingView' in window && (window as any).TradingView.widget) {
        // If widget already exists, just update symbol and theme
        if (widgetRef.current) {
          widgetRef.current.onChartReady(() => {
            if (widgetRef.current) {
              const chart = widgetRef.current.chart();
              chart.setSymbol(symbol);
              widgetRef.current.changeTheme(theme === 'dark' ? 'dark' : 'light');
            }
          });
          return;
        }
        
        container.current.innerHTML = '';
        const containerId = `tradingview_widget_${Date.now()}`;
        container.current.id = containerId;
        
        const widgetOptions = {
          width: '100%',
          height: '100%',
          symbol: symbol || 'AAPL',
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: theme === 'dark' ? 'dark' : 'light',
          style: String(style),
          locale: 'en',
          enable_publishing: false,
          allow_symbol_change: true, // Allow user to change symbol in widget
          studies: indicators.map(ind => indicatorMap[ind]),
          container_id: containerId
        };

        const tvWidget = new (window as any).TradingView.widget(widgetOptions);
        widgetRef.current = tvWidget;
      }
    };

    const loadScriptAndCreateWidget = () => {
        if (isScriptReady.current) {
            createWidget();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.type = 'text/javascript';
        script.async = true;
        script.onload = () => {
            isScriptReady.current = true;
            createWidget();
        };
        document.head.appendChild(script);
    }
    
    loadScriptAndCreateWidget();

  }, [symbol, style, indicators, theme]);

  return <div ref={container} className="h-full w-full" />;
});
