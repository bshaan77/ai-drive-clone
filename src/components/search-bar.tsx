/**
 * Search Bar Component
 *
 * Provides real-time search functionality with debouncing
 * Displays search results in a dropdown or navigates to search page
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface SearchResult {
  id: string;
  name: string;
  type: "file" | "folder";
  path?: string;
}

interface SearchBarProps {
  onResultSelect: (result: SearchResult) => void;
  className?: string;
}

export function SearchBar({ onResultSelect, className }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    void performSearch(debouncedQuery);
  }, [debouncedQuery]);

  const performSearch = async (searchQuery: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`,
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = (await response.json()) as {
        success: boolean;
        results?: SearchResult[];
        error?: string;
      };

      if (data.success && data.results) {
        setResults(data.results);
      } else {
        setResults([]);
      }
    } catch (error) {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim()) {
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleResultSelect = (result: SearchResult) => {
    onResultSelect(result);
    setQuery("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search files and folders..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (query.trim()) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 pr-10 pl-10 text-sm placeholder:text-gray-500 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:outline-none"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2 p-0 hover:bg-gray-100"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && query.trim() && (
        <div className="absolute top-full right-0 left-0 z-50 mt-1 rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Searching...</div>
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultSelect(result)}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium text-gray-900">
                        {result.name}
                      </div>
                      {result.path && (
                        <div className="truncate text-sm text-gray-500">
                          {result.path}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 uppercase">
                      {result.type}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No results found for &quot;{query}&quot;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
