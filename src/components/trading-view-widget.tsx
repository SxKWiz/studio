"use client";

import React, { useEffect, useRef, memo, useState } from 'react';
import type { ChartStyle, Indicator } from '@/types/chart';
import { ChartLoadingSkeleton } from './chart-loading-skeleton';

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
  'MACD': 'MACD@tv-basicstudies',
  'Stochastic': 'Stochastic@tv-basicstudies',
  'Williams %R': 'WilliamsR@tv-basicstudies',
  'Volume': 'Volume@tv-basicstudies',
  'Momentum': 'Momentum@tv-basicstudies',
};

// Global flag to track if TradingView script is loading/loaded
let scriptLoading = false;
let scriptLoaded = false;

export const TradingViewWidget: React.FC<TradingViewWidgetProps> = memo(function TradingViewWidget({
  symbol,
  style,
  indicators,
  theme,
}) {
  const container = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any | null>(null);
  const lastProps = useRef({ symbol, style, indicators, theme });
  const [isLoading, setIsLoading] = useState(true);

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
             setIsLoading(true);
             widgetRef.current.remove();
             widgetRef.current = null;
          } else {
            // If other props change, we don't want to re-render and lose user's in-chart changes
            return;
          }
        }
        
        if (!container.current.id) {
            container.current.id = `tradingview_widget_${Date.now()}_${Math.random()}`;
        }
        
        // Only create a new widget if one doesn't exist
        if (!widgetRef.current) {
            const tvWidget = new (window as any).TradingView.widget(widgetOptions);
            widgetRef.current = tvWidget;
            
            // Set up loading completion handler
            tvWidget.onChartReady(() => {
              setIsLoading(false);
            });
        }

        lastProps.current = { symbol, style, indicators, theme };
      }
    };

    const loadScriptAndCreateWidget = () => {
        if (scriptLoaded) {
            createWidget();
            return;
        }
        
        if (scriptLoading) {
            // Script is already loading, wait for it
            const checkScript = () => {
                if (scriptLoaded) {
                    createWidget();
                } else {
                    setTimeout(checkScript, 100);
                }
            };
            checkScript();
            return;
        }
        
        // Check if script already exists
        const existingScript = document.querySelector('script[src="https://s3.tradingview.com/tv.js"]');
        if (existingScript) {
            if ('TradingView' in window) {
                scriptLoaded = true;
                createWidget();
            }
            return;
        }
        
        scriptLoading = true;
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.type = 'text/javascript';
        script.async = true;
        script.onload = () => {
            scriptLoaded = true;
            scriptLoading = false;
            createWidget();
        };
        script.onerror = () => {
            console.error("TradingView script failed to load.");
            scriptLoading = false;
            setIsLoading(false);
        }
        document.head.appendChild(script);
    }
    
    loadScriptAndCreateWidget();

    // Return proper cleanup function
    return () => {
      if (widgetRef.current) {
        try {
          widgetRef.current.remove();
        } catch (error) {
          console.warn('Error removing TradingView widget:', error);
        }
        widgetRef.current = null;
      }
    };
  }, [symbol, style, indicators, theme]);

  if (isLoading) {
    return <ChartLoadingSkeleton />;
  }

  return <div ref={container} className="h-full w-full" />;
});
