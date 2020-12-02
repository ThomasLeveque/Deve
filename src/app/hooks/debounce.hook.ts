import { useState, useEffect } from 'react';

// Our hook
const useDebounce = (value: string, delay: number): string => {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState<string>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return debouncedValue;
};

export default useDebounce;
