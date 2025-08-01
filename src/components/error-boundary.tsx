'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  resetError: () => void;
}

function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="rounded-full bg-red-50 p-3 mb-4">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        Something went wrong
      </h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        {error?.message || 'An unexpected error occurred. Please try refreshing the page.'}
      </p>
      <div className="flex gap-3">
        <Button onClick={resetError} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
        <Button 
          onClick={() => window.location.reload()} 
          variant="default"
        >
          Refresh Page
        </Button>
      </div>
      {process.env.NODE_ENV === 'development' && error && (
        <details className="mt-6 p-4 bg-gray-100 rounded-lg text-left max-w-2xl">
          <summary className="cursor-pointer font-medium">Error Details</summary>
          <pre className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  );
}

// Chart-specific error boundary for TradingView widget
export function ChartErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-card border rounded-lg">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Chart Loading Error
          </h3>
          <p className="text-muted-foreground mb-4">
            Failed to load the trading chart. This might be due to network issues or TradingView service problems.
          </p>
          <Button onClick={resetError} size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry Chart
          </Button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}