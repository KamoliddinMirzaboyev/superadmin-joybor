import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // xato-tracking xizmati ulanganda shu yerga yuboriladi
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl border border-surface-200 shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-danger-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-danger-600" />
            </div>
            <h2 className="text-2xl font-bold text-surface-900 mb-4">Xatolik yuz berdi</h2>
            <p className="text-surface-600 mb-6">
              Sahifani ko'rsatishda kutilmagan xatolik yuz berdi.
            </p>
            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-surface-500 mb-2">
                  Texnik ma'lumotlar
                </summary>
                <pre className="text-xs bg-surface-100 p-3 rounded-xl overflow-auto text-danger-600">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-brand-600 text-white px-4 py-2 rounded-xl hover:bg-brand-700 flex items-center justify-center gap-2 transition-colors duration-150"
              >
                <RefreshCw className="w-4 h-4" />
                Qaytadan urinish
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-surface-100 text-surface-800 px-4 py-2 rounded-xl hover:bg-surface-200 transition-colors duration-150"
              >
                Sahifani yangilash
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
