import React from 'react';

export function ChartLoadingSkeleton() {
  return (
    <div className="h-full w-full bg-card border rounded-lg p-4 animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <div className="h-6 bg-gray-300 rounded w-20"></div>
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </div>
        <div className="flex space-x-2">
          <div className="h-4 bg-gray-300 rounded w-12"></div>
          <div className="h-4 bg-gray-300 rounded w-12"></div>
          <div className="h-4 bg-gray-300 rounded w-12"></div>
        </div>
      </div>
      
      {/* Chart area skeleton */}
      <div className="relative h-[calc(100%-60px)] bg-gray-100 rounded">
        {/* Price axis */}
        <div className="absolute right-2 top-4 space-y-8">
          <div className="h-3 bg-gray-300 rounded w-12"></div>
          <div className="h-3 bg-gray-300 rounded w-12"></div>
          <div className="h-3 bg-gray-300 rounded w-12"></div>
          <div className="h-3 bg-gray-300 rounded w-12"></div>
          <div className="h-3 bg-gray-300 rounded w-12"></div>
        </div>
        
        {/* Chart bars/candles simulation */}
        <div className="absolute bottom-8 left-4 right-16 flex items-end space-x-1">
          {Array.from({ length: 50 }, (_, i) => (
            <div
              key={i}
              className="bg-gray-300 rounded-sm flex-1"
              style={{
                height: `${Math.random() * 60 + 20}%`,
                opacity: 0.3 + Math.random() * 0.4,
              }}
            />
          ))}
        </div>
        
        {/* Time axis */}
        <div className="absolute bottom-2 left-4 right-16 flex justify-between">
          <div className="h-3 bg-gray-300 rounded w-16"></div>
          <div className="h-3 bg-gray-300 rounded w-16"></div>
          <div className="h-3 bg-gray-300 rounded w-16"></div>
          <div className="h-3 bg-gray-300 rounded w-16"></div>
        </div>
        
        {/* Loading text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm">Loading Chart...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AnalysisLoadingSkeleton() {
  return (
    <div className="space-y-6 p-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
      
      <div className="space-y-3">
        <div className="h-5 bg-gray-300 rounded w-1/3"></div>
        <div className="flex space-x-2">
          <div className="h-8 bg-gray-300 rounded-full w-20"></div>
          <div className="h-8 bg-gray-300 rounded-full w-20"></div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="h-5 bg-gray-300 rounded w-1/4"></div>
        <div className="space-y-2">
          <div className="h-16 bg-gray-200 rounded border p-3">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
          </div>
          <div className="h-16 bg-gray-200 rounded border p-3">
            <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/3"></div>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="h-5 bg-gray-300 rounded w-1/3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-4/5"></div>
        </div>
      </div>
    </div>
  );
}