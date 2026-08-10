import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorState } from '@/components/ui';

interface RouteErrorBoundaryProps {
  children: ReactNode;
  resetKey: string;
}

interface RouteErrorBoundaryState {
  hasError: boolean;
}

/**
 * A failed lazy chunk must not leave the application shell blank. Changing to
 * another route clears the failure; reloading obtains the current deployment's
 * chunk when a browser still has an older HTML entry cached.
 */
export class RouteErrorBoundary extends Component<
  RouteErrorBoundaryProps,
  RouteErrorBoundaryState
> {
  state: RouteErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): RouteErrorBoundaryState {
    return { hasError: true };
  }

  componentDidUpdate(previousProps: RouteErrorBoundaryProps) {
    if (
      this.state.hasError &&
      previousProps.resetKey !== this.props.resetKey
    ) {
      this.setState({ hasError: false });
    }
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // The fallback is intentionally quiet: network/chunk errors are shown to
    // the operator, while the route remains recoverable without losing state.
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorState
          title="No pudimos abrir esta sección"
          message="Es posible que la aplicación se haya actualizado. Recarga para obtener la versión actual."
          onRetry={() => window.location.reload()}
        />
      );
    }

    return this.props.children;
  }
}
