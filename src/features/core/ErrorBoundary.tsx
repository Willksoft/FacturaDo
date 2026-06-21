import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-neutral-100">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Algo salió mal</h1>
            <p className="text-neutral-500 mb-8 text-sm">
              La aplicación encontró un error inesperado. Por favor, recarga la página e intenta de nuevo.
            </p>
            
            {this.state.error && (
              <div className="bg-neutral-100 p-4 rounded-xl text-left overflow-x-auto mb-8">
                <p className="text-xs font-mono text-neutral-700 whitespace-pre-wrap">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <button
              onClick={this.handleReload}
              className="w-full flex items-center justify-center space-x-2 bg-neutral-950 text-white py-3 rounded-xl hover:bg-neutral-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Recargar Aplicación</span>
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
