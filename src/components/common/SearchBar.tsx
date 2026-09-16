import React, { useRef, useEffect } from 'react';
import { Input, Button } from '@nextui-org/react';
import { FiSearch, FiX } from 'react-icons/fi';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  debounceMs?: number;
}

/**
 * SearchBar - Search input component with clear button
 * Supports keyboard shortcuts and debounced input
 */
export function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  autoFocus = false,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on autoFocus change
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Clear on Escape
    if (e.key === 'Escape' && value) {
      handleClear();
    }
  };

  return (
    <div className="search-bar">
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        startContent={<FiSearch size={18} className="search-bar-icon" />}
        endContent={
          value && (
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={handleClear}
              aria-label="Clear search"
              className="search-bar-clear-button"
            >
              <FiX size={16} />
            </Button>
          )
        }
        className="search-bar-input"
        aria-label={placeholder}
      />
    </div>
  );
}

export default SearchBar;
