'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Keyboard, HelpCircle } from 'lucide-react';

interface KeyboardShortcut {
  key: string;
  description: string;
}

interface KeyboardShortcutsHelpProps {
  shortcuts: KeyboardShortcut[];
}

export function KeyboardShortcutsHelp({ shortcuts }: KeyboardShortcutsHelpProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 w-9 p-0"
          title="Keyboard shortcuts (? to open)"
        >
          <Keyboard className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Use these keyboard shortcuts to navigate the app more efficiently:
          </p>
          <div className="space-y-2">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium">{shortcut.description}</span>
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Tip: Press <kbd className="px-1 py-0.5 text-xs bg-gray-100 border rounded dark:bg-gray-600">?</kbd> anytime to open this help.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}