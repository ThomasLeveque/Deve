import React, { createContext, useState, useEffect } from 'react';

interface ISearchContext {
  isSearchOpen: boolean;
  firstSearchOpen: boolean;
  toggleSearch: (value: boolean) => void;
}

export const SearchContext = createContext<ISearchContext>({
  isSearchOpen: false,
  firstSearchOpen: false,
  toggleSearch: null
});

const SearchProvider: React.FC = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [firstSearchOpen, setFirstSearchOpen] = useState<boolean>(false);

  const toggleSearch = (value: boolean): void => {
    setIsSearchOpen(value);
    setFirstSearchOpen(true);
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
        firstSearchOpen,
        toggleSearch
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
