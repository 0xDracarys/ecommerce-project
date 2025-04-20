'use client';

import { useEffect } from 'react';
import Container from '@/components/ui/container';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

const Error = ({
  error,
  reset
}: ErrorProps) => {
  useEffect(() => {
    console.error('Runtime error:', error);
  }, [error]);

  return (
    <Container>
      <div className="flex flex-col items-center justify-center h-full px-4 py-24 text-center">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="mt-4 text-neutral-600">
          {error.message || 'Sorry, we encountered an unexpected error.'}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 mt-8 font-medium text-white transition rounded-md bg-black hover:opacity-80"
        >
          Try again
        </button>
      </div>
    </Container>
  );
};

export default Error; 