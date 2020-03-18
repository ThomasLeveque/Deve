import React, { useState } from 'react';
import { Icon } from 'antd';
import { connectSearchBox } from 'react-instantsearch-dom';
import { SearchBoxProvided } from 'react-instantsearch-core';

import './search-input.styles.less';

const SearchInput: React.FC<SearchBoxProvided> = ({ currentRefinement, refine }) => {
  const [value, setValue] = useState<string>(currentRefinement);

  const handleSearchSubmit = (event: any): void => {
    if (event.key && event.key !== 'Enter') {
      return;
    }
    refine(value);
  };

  const handleSearchReset = (): void => {
    setValue('');
    refine('');
  };

  return (
    <div className="search-input">
      <div className="search-input-container">
        <input
          autoFocus
          className="search-input-item"
          type="search"
          value={value}
          placeholder="Type something..."
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value)}
          onKeyPress={handleSearchSubmit}
        />
        <Icon type="search" theme="outlined" className="search-input-icon green submit" onClick={handleSearchSubmit} />
        {value.length !== 0 && (
          <Icon type="close-circle" theme="filled" className="search-input-icon gray reset" onClick={handleSearchReset} />
        )}
      </div>
    </div>
  );
};

export default connectSearchBox(SearchInput);
