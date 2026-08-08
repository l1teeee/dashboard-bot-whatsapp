import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { MotionConfig } from 'framer-motion';
import '@fontsource-variable/manrope';
import '@fontsource/barlow-condensed/400.css';
import '@fontsource/barlow-condensed/600.css';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/barlow-condensed/800.css';
import { queryClient } from '@/api/queryClient';
import { App } from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster position="top-right" toastOptions={{ style: { background: 'var(--color-surface-raised)', color: 'var(--color-ink)', border: '1px solid var(--color-border)', borderRadius: '18px', boxShadow: '0 3px 0 #081C1E' } }} />
      </QueryClientProvider>
    </MotionConfig>
  </StrictMode>,
);
