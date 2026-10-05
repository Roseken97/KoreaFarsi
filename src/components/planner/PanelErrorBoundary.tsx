"use client";

import { Component, type ReactNode } from "react";

/**
 * Real error boundary (class component) around one carousel panel's server-rendered
 * output. Unlike a try/catch in the server component tree — which only sees
 * exceptions thrown by its own synchronous body, not ones thrown while React later
 * renders the JSX it returned — this actually catches errors from anywhere in the
 * panel's subtree, so one broken tab no longer blanks the whole Planner page.
 */
export class PanelErrorBoundary extends Component<{ tab: string; children: ReactNode }, { error: (Error & { digest?: string }) | null }> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error & { digest?: string }) {
    console.error(`[planner] "${this.props.tab}" panel crashed:`, error);
  }

  render() {
    const error = this.state.error as (Error & { digest?: string }) | null;
    if (error) {
      return (
        <div className="rounded-card border border-dashed border-danger/40 bg-danger-soft p-5 text-center text-sm text-danger" dir="ltr">
          Couldn&apos;t load this tab.
          <p className="mt-1 text-xs opacity-80">
            {error.message}
            {error.digest && ` (digest: ${error.digest})`}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
