import React, { useState, useRef } from 'react';
import { SearchOutlined, CloseCircleFilled } from '@ant-design/icons';
import { connectSearchBox } from 'react-instantsearch-dom';
import { SearchBoxProvided } from 'react-instantsearch-core';

import './search-input.styles.less';

const SearchInput: React.FC<SearchBoxProvided> = ({ currentRefinement, refine }) => {
  const [value, setValue] = useState<string>(currentRefinement);

  const inputRef = useRef(null)

  const handleSearchSubmit = (event: any): void => {
    if (event.key && event.key !== 'Enter') {
      return;
    }
    inputRef.current.blur();
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
          ref={inputRef}
          autoFocus
          className="search-input-item"
          type="search"
          value={value}
          placeholder="Type something..."
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value)}
          onKeyPress={handleSearchSubmit}
        />
        <SearchOutlined className="search-input-icon green submit" onClick={handleSearchSubmit} />
        {value.length !== 0 && <CloseCircleFilled className="search-input-icon gray reset" onClick={handleSearchReset} />}
      </div>
    </div>
  );
};

export default connectSearchBox(SearchInput);
