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
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const createWidget = () => {
      if (!container.current) return;
      
      if (!('TradingView' in window) || !(window as any).TradingView?.widget) {
        console.error('TradingView library not available');
        setError('Chart library not available');
        setIsLoading(false);
        return;
      }

      try {
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
          studies: indicators.map(ind => indicatorMap[ind]).filter(Boolean),
          container_id: container.current.id,
        };

        // Clean up existing widget if necessary
        if (widgetRef.current) {
          if (
            lastProps.current.symbol !== symbol ||
            lastProps.current.theme !== theme
          ) {
            setIsLoading(true);
            setError(null);
            try {
              widgetRef.current.remove();
            } catch (e) {
              console.warn('Error removing existing widget:', e);
            }
            widgetRef.current = null;
          } else {
            // If only indicators changed, don't recreate widget
            lastProps.current = { symbol, style, indicators, theme };
            return;
          }
        }
        
        // Ensure container has an ID
        if (!container.current.id) {
          container.current.id = `tradingview_widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
        
        // Create new widget
        if (!widgetRef.current) {
          const tvWidget = new (window as any).TradingView.widget(widgetOptions);
          widgetRef.current = tvWidget;
          
          // Set up loading timeout
          timeoutRef.current = setTimeout(() => {
            if (isLoading) {
              console.warn('Chart loading timeout');
              setError('Chart loading timed out. Please try refreshing.');
              setIsLoading(false);
            }
          }, 30000); // 30 second timeout
          
          // Set up loading completion handler
          tvWidget.onChartReady(() => {
            setIsLoading(false);
            setError(null);
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
          });
        }

        lastProps.current = { symbol, style, indicators, theme };
      } catch (error) {
        console.error('Error creating TradingView widget:', error);
        setError('Failed to create chart');
        setIsLoading(false);
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
          } else if (scriptLoading) {
            setTimeout(checkScript, 100);
          } else {
            // Script loading failed
            setError('Failed to load chart library');
            setIsLoading(false);
          }
        };
        checkScript();
        return;
      }
      
      // Check if script already exists and is loaded
      const existingScript = document.querySelector('script[src="https://s3.tradingview.com/tv.js"]');
      if (existingScript && 'TradingView' in window && (window as any).TradingView?.widget) {
        scriptLoaded = true;
        createWidget();
        return;
      }
      
      // Load script
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
        console.error('TradingView script failed to load');
        scriptLoading = false;
        setError('Failed to load chart library');
        setIsLoading(false);
      };
      
      document.head.appendChild(script);
    };
    
    loadScriptAndCreateWidget();

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
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

  if (error) {
    return (
      <div className="h-full w-full bg-card border rounded-lg p-4 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p className="text-sm mb-2">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              setIsLoading(true);
              // Force reload by clearing the script state
              scriptLoaded = false;
              scriptLoading = false;
            }}
            className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <ChartLoadingSkeleton />;
  }

  return <div ref={container} className="h-full w-full" />;
});
