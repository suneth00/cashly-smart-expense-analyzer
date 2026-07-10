import { createContext, useContext, useState, useCallback } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState('');

  const clearSearch = useCallback(() => setQuery(''), []);

  return (
    <SearchContext.Provider value={{ query, setQuery, clearSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
