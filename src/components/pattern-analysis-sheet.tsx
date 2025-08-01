'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import type { SuggestChartPatternsOutput } from '@/ai/flows/suggest-chart-patterns';

interface PatternAnalysisSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analysis: SuggestChartPatternsOutput;
  ticker: string;
}

export function PatternAnalysisSheet({
  open,
  onOpenChange,
  analysis,
  ticker,
}: PatternAnalysisSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader className="mb-6 text-left">
          <SheetTitle className="text-2xl">
            AI Pattern Analysis for {ticker}
          </SheetTitle>
          <SheetDescription>
            Potential patterns identified by our AI. This is not financial advice.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2 text-foreground">Identified Patterns</h3>
            {analysis.patterns.length > 0 ? (
              <ul className="space-y-3">
                {analysis.patterns.map((pattern, index) => (
                  <li key={index} className="p-4 rounded-lg border bg-card/50">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{pattern}</span>
                      <Badge variant={analysis.confidenceLevels[index] > 0.7 ? 'default' : 'secondary'}>
                        Confidence: {(analysis.confidenceLevels[index] * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No specific patterns were identified.</p>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 text-foreground">Overall Analysis</h3>
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {analysis.analysis}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
