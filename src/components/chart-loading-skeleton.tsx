import React from 'react';

// Predefined values to avoid hydration mismatch
const chartBarData = [
  { height: 70.61, opacity: 0.306 },
  { height: 25.73, opacity: 0.626 },
  { height: 38.15, opacity: 0.513 },
  { height: 54.59, opacity: 0.336 },
  { height: 62.61, opacity: 0.362 },
  { height: 76.79, opacity: 0.415 },
  { height: 25.96, opacity: 0.320 },
  { height: 45.09, opacity: 0.327 },
  { height: 58.20, opacity: 0.534 },
  { height: 74.21, opacity: 0.623 },
  { height: 78.88, opacity: 0.399 },
  { height: 49.48, opacity: 0.554 },
  { height: 63.88, opacity: 0.329 },
  { height: 52.73, opacity: 0.622 },
  { height: 29.42, opacity: 0.341 },
  { height: 24.30, opacity: 0.537 },
  { height: 71.84, opacity: 0.402 },
  { height: 21.84, opacity: 0.319 },
  { height: 37.95, opacity: 0.574 },
  { height: 78.40, opacity: 0.432 },
  { height: 30.42, opacity: 0.533 },
  { height: 29.44, opacity: 0.482 },
  { height: 36.96, opacity: 0.673 },
  { height: 72.05, opacity: 0.675 },
  { height: 24.33, opacity: 0.590 },
  { height: 67.20, opacity: 0.677 },
  { height: 70.46, opacity: 0.519 },
  { height: 28.18, opacity: 0.660 },
  { height: 27.36, opacity: 0.301 },
  { height: 53.20, opacity: 0.537 },
  { height: 59.94, opacity: 0.322 },
  { height: 48.34, opacity: 0.608 },
  { height: 35.58, opacity: 0.359 },
  { height: 53.75, opacity: 0.474 },
  { height: 25.51, opacity: 0.346 },
  { height: 66.26, opacity: 0.369 },
  { height: 25.17, opacity: 0.403 },
  { height: 34.91, opacity: 0.674 },
  { height: 62.93, opacity: 0.344 },
  { height: 55.71, opacity: 0.321 },
  { height: 52.35, opacity: 0.309 },
  { height: 78.47, opacity: 0.325 },
  { height: 49.32, opacity: 0.382 },
  { height: 65.24, opacity: 0.597 },
  { height: 49.70, opacity: 0.586 },
  { height: 26.73, opacity: 0.506 },
  { height: 69.77, opacity: 0.566 },
  { height: 68.56, opacity: 0.462 },
  { height: 47.79, opacity: 0.479 },
  { height: 67.37, opacity: 0.455 },
];

const ChartLoadingSkeleton = () => {
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
          {chartBarData.map((bar, i) => (
            <div
              key={i}
              className="bg-gray-300 rounded-sm flex-1"
              style={{
                height: `${bar.height}%`,
                opacity: bar.opacity,
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
};

export { ChartLoadingSkeleton };

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