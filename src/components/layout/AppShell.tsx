import React from 'react';
import { NextUIProvider } from '@nextui-org/react';

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * AppShell - Main layout wrapper component
 * Provides NextUI theming and base layout structure
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <NextUIProvider>
      <div className="app-shell">{children}</div>
    </NextUIProvider>
  );
}

export default AppShell;
