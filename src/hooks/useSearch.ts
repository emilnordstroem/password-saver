import { useState, useCallback, useEffect } from 'react';
import type { PasswordEntry } from '../types/password';

interface UseSearchProps {
  initialPasswords?: PasswordEntry[];
  onSearch?: (query: string) => Promise<PasswordEntry[]> | void;
  debounceMs?: number;
}

interface UseSearchReturn {
  query: string;
  results: PasswordEntry[];
  isSearching: boolean;
  hasResults: boolean;
  setQuery: (query: string) => void;
  clearQuery: () => void;
}

export function useSearch(props: UseSearchProps = {}): UseSearchReturn {
  const { initialPasswords = [], onSearch, debounceMs = 300 } = props;
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<PasswordEntry[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [timeoutRef, setTimeoutRef] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Clear existing timeout
  const clearCurrentTimeout = useCallback(() => {
    if (timeoutRef) {
      clearTimeout(timeoutRef);
      setTimeoutRef(null);
    }
  }, [timeoutRef]);

  // Perform the search
  const performSearch = useCallback(
    async (searchQuery: string) => {
      setIsSearching(true);
      
      if (!searchQuery.trim()) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      try {
        if (onSearch) {
          // Use custom search function if provided
          const searchResults = await onSearch(searchQuery);
          setResults(Array.isArray(searchResults) ? searchResults : []);
        } else {
          // Perform local filtering
          const lowerQuery = searchQuery.toLowerCase();
          const filtered = initialPasswords.filter(
            (password) =>
              password.title.toLowerCase().includes(lowerQuery) ||
              (password.username?.toLowerCase().includes(lowerQuery) ?? false) ||
              (password.url?.toLowerCase().includes(lowerQuery) ?? false) ||
              (password.notes?.toLowerCase().includes(lowerQuery) ?? false)
          );
          setResults(filtered);
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [initialPasswords, onSearch]
  );

  // Handle query changes with debounce
  const handleQueryChange = useCallback(
    (newQuery: string) => {
      setQuery(newQuery);
      
      // Clear existing timeout
      clearCurrentTimeout();
      
      // Set new timeout for debounced search
      const newTimeout = setTimeout(() => {
        performSearch(newQuery);
      }, debounceMs);
      
      setTimeoutRef(newTimeout);
    },
    [clearCurrentTimeout, performSearch, debounceMs]
  );

  // Clear query
  const clearQuery = useCallback(() => {
    setQuery('');
    setResults([]);
    clearCurrentTimeout();
  }, [clearCurrentTimeout]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearCurrentTimeout();
    };
  }, [clearCurrentTimeout]);

  // Update results when initialPasswords change and there's an active query
  useEffect(() => {
    if (query && initialPasswords.length > 0 && !onSearch) {
      const lowerQuery = query.toLowerCase();
      const filtered = initialPasswords.filter(
        (password) =>
          password.title.toLowerCase().includes(lowerQuery) ||
          (password.username?.toLowerCase().includes(lowerQuery) ?? false) ||
          (password.url?.toLowerCase().includes(lowerQuery) ?? false) ||
          (password.notes?.toLowerCase().includes(lowerQuery) ?? false)
      );
      setResults(filtered);
    }
  }, [initialPasswords, query, onSearch]);

  return {
    query,
    results,
    isSearching,
    hasResults: results.length > 0,
    setQuery: handleQueryChange,
    clearQuery,
  };
}

export default useSearch;
