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
  const isScriptAdded = useRef(false);

  useEffect(() => {
    const createWidget = () => {
      if (container.current && 'TradingView' in window && (window as any).TradingView.widget) {
        container.current.innerHTML = '';
        
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
          allow_symbol_change: false,
          studies: indicators.map(ind => indicatorMap[ind]),
          container_id: `tradingview_widget_${Date.now()}`
        };

        container.current.id = widgetOptions.container_id;

        new (window as any).TradingView.widget(widgetOptions);
      }
    };

    if (!isScriptAdded.current) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.type = 'text/javascript';
      script.async = true;
      script.onload = createWidget;
      document.head.appendChild(script);
      isScriptAdded.current = true;
    } else {
      createWidget();
    }
  }, [symbol, style, indicators, theme]);

  return <div ref={container} className="h-full w-full" />;
});
