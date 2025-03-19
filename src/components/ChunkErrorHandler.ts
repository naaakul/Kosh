'use client';

import { useEffect } from 'react';

export default function ChunkErrorHandler() {
  useEffect(() => {
    const handleChunkError = (event) => {
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