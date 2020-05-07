import React, { createContext, useState, useEffect, memo, useContext } from 'react';

interface ISearchContext {
  isSearchOpen: boolean;
  toggleSearch: (value: boolean) => void;
}

export const SearchContext = createContext<ISearchContext>({
  isSearchOpen: false,
  toggleSearch: null
});

export const useSearch = () => useContext(SearchContext);

const SearchProvider: React.FC = memo(({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const toggleSearch = (value: boolean): void => {
    setIsSearchOpen(value);
  };

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.removeAttribute('style');
    }
  }, [isSearchOpen]);

  return (
    <SearchContext.Provider
      value={{
        isSearchOpen,
        toggleSearch
      }}
    >
      {children}
    </SearchContext.Provider>
  );
});

export default SearchProvider;
