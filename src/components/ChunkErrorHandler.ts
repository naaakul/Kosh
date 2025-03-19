'use client';

import { useEffect } from 'react';

export default function ChunkErrorHandler() {
  useEffect(() => {
    interface ErrorEvent {
      message?: string;
      error?: {
        message?: string;
      };
    }

    const handleChunkError = (event: ErrorEvent): void => {
      if (
        event.message?.includes('ChunkLoadError') || 
        (event.error && event.error.message && event.error.message.includes('ChunkLoadError'))
      ) {
        console.log('Chunk load error detected, refreshing page...');
        window.location.reload();
      }
    };

    window.addEventListener('error', handleChunkError);
    
    return () => {
      window.removeEventListener('error', handleChunkError);
    };
  }, []);

  return null;
}