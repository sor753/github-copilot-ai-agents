import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter } from 'react-router-dom';

import { App } from './App';
import { queryClient } from './shared/lib/query-client';

import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container not found');
}

createRoot(container).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary
        fallbackRender={({ error }) => (
          <div className="mx-auto flex min-h-screen max-w-content flex-col justify-center gap-3 px-4 text-stone-900">
            <h1 className="text-2xl font-bold">予期しないエラーが発生しました</h1>
            <p className="text-sm text-stone-700">
              アプリの表示を継続できません。ページを再読み込みしてください。
            </p>
            <p className="text-sm text-danger">{error.message}</p>
          </div>
        )}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>
);
