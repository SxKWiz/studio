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
  const lastProps = useRef({ symbol, style, indicators, theme });

  useEffect(() => {
    const createWidget = () => {
      if (container.current && 'TradingView' in window && (window as any).TradingView.widget) {
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
          allow_symbol_change: true,
          studies: indicators.map(ind => indicatorMap[ind]),
          container_id: container.current.id,
        };

        // If widget already exists, and only symbol or theme changed, just recreate it.
        // This is simpler and more reliable than trying to update it in-place.
        if (widgetRef.current) {
          if (
            lastProps.current.symbol !== symbol ||
            lastProps.current.theme !== theme
          ) {
             widgetRef.current.remove();
             widgetRef.current = null;
          } else {
            // If other props change, we don't want to re-render and lose user's in-chart changes
            return;
          }
        }
        
        if (!container.current.id) {
            container.current.id = `tradingview_widget_${Date.now()}`;
        }
        
        // Only create a new widget if one doesn't exist
        if (!widgetRef.current) {
            const tvWidget = new (window as any).TradingView.widget(widgetOptions);
            widgetRef.current = tvWidget;
        }

        lastProps.current = { symbol, style, indicators, theme };
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
        script.onerror = () => {
          console.error("TradingView script failed to load.");
        }
        document.head.appendChild(script);
    }
    
    loadScriptAndCreateWidget();

    return () => {
      // Cleanup script tag on component unmount
      const script = document.querySelector('script[src="https://s3.tradingview.com/tv.js"]');
      if (script && script.parentElement && container.current === null) {
          // Only remove if we are truly unmounting, not just re-rendering
          // script.parentElement.removeChild(script);
      }
    };
  }, [symbol, style, indicators, theme]);

  return <div ref={container} className="h-full w-full" />;
});
