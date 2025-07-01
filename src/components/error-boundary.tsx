/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of the crashed component.
 */

"use client";

import React from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "~/components/ui/button";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to console or error reporting service
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback component
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            resetError={this.resetError}
          />
        );
      }

      // Default fallback UI
      return (
        <DefaultErrorFallback
          error={this.state.error}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Default Error Fallback Component
 */
function DefaultErrorFallback({
  error,
  resetError,
}: {
  error?: Error;
  resetError: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Something went wrong
          </h2>
          <p className="mb-4 text-gray-600">
            We encountered an unexpected error. Please try refreshing the page
            or contact support if the problem persists.
          </p>

          {error && (
            <details className="mb-4 text-left">
              <summary className="cursor-pointer text-sm font-medium text-gray-700">
                Error Details
              </summary>
              <div className="mt-2 rounded bg-gray-100 p-3 text-xs text-gray-600">
                <p className="font-mono">{error.message}</p>
                {error.stack && (
                  <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap">
                    {error.stack}
                  </pre>
                )}
              </div>
            </details>
          )}

          <div className="flex gap-3">
            <Button
              onClick={resetError}
              className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
              className="flex-1 gap-2"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
