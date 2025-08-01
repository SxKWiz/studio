'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SuggestChartPatternsOutput } from '@/ai/flows/suggest-chart-patterns';

interface CacheEntry {
  data: SuggestChartPatternsOutput;
  timestamp: number;
  expiry: number;
}

interface CacheKey {
  ticker: string;
  indicators: string;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 20; // Maximum number of cached entries

class AnalysisCache {
  private cache = new Map<string, CacheEntry>();

  private generateKey(ticker: string, indicators: string[]): string {
    return `${ticker}:${indicators.sort().join(',')}`;
  }

  get(ticker: string, indicators: string[]): SuggestChartPatternsOutput | null {
    const key = this.generateKey(ticker, indicators);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(ticker: string, indicators: string[], data: SuggestChartPatternsOutput): void {
    const key = this.generateKey(ticker, indicators);
    const now = Date.now();

    // If cache is at max size, remove oldest entry
    if (this.cache.size >= MAX_CACHE_SIZE) {
      let oldestKey = '';
      let oldestTime = Infinity;

      for (const [cacheKey, entry] of this.cache.entries()) {
        if (entry.timestamp < oldestTime) {
          oldestTime = entry.timestamp;
          oldestKey = cacheKey;
        }
      }

      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: now,
      expiry: now + CACHE_DURATION,
    });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

// Global cache instance
const analysisCache = new AnalysisCache();

export function useAnalysisCache() {
  const [cacheSize, setCacheSize] = useState(analysisCache.size());

  // Update cache size when cache changes
  useEffect(() => {
    const interval = setInterval(() => {
      analysisCache.cleanup();
      setCacheSize(analysisCache.size());
    }, 60000); // Cleanup every minute

    return () => clearInterval(interval);
  }, []);

  const getCachedAnalysis = useCallback((ticker: string, indicators: string[]): SuggestChartPatternsOutput | null => {
    return analysisCache.get(ticker, indicators);
  }, []);

  const setCachedAnalysis = useCallback((ticker: string, indicators: string[], data: SuggestChartPatternsOutput): void => {
    analysisCache.set(ticker, indicators, data);
    setCacheSize(analysisCache.size());
  }, []);

  const clearCache = useCallback((): void => {
    analysisCache.clear();
    setCacheSize(0);
  }, []);

  const isCached = useCallback((ticker: string, indicators: string[]): boolean => {
    return getCachedAnalysis(ticker, indicators) !== null;
  }, [getCachedAnalysis]);

  return {
    getCachedAnalysis,
    setCachedAnalysis,
    clearCache,
    isCached,
    cacheSize,
  };
}