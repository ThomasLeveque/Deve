import React from 'react';
import { SearchOutlined } from '@ant-design/icons';

import './filter-categories-input.styles.less';

interface IProps {
  value: string;
  name: string;
  placeholder: string;
  type?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const FilterCategoriesInput: React.FC<IProps> = ({ onChange, value, name, placeholder, type = 'text' }) => {
  return (
    <div className="filter-categories-input">
      <div className="filter-categories-input-container">
        <input
          onChange={onChange}
          type={type}
          value={value}
          name={name}
          placeholder={placeholder}
          autoComplete="off"
          className="filter-categories-input-item"
        />
        {<SearchOutlined className="filter-categories-input-icon" />}
      </div>
    </div>
  );
};

export default FilterCategoriesInput;
