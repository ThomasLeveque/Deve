import React from 'react';
import { SearchOutlined, CloseCircleFilled } from '@ant-design/icons';

import './filter-categories-input.styles.less';

interface IProps {
  value: string;
  name: string;
  placeholder: string;
  type?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterCategoriesReset: () => void;
}

const FilterCategoriesInput: React.FC<IProps> = ({ onChange, onFilterCategoriesReset, value, name, placeholder, type = 'text' }) => {
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
        <SearchOutlined className="filter-categories-input-icon search" />
        {value.length > 0 && <CloseCircleFilled className="filter-categories-input-icon reset pointer" onClick={onFilterCategoriesReset} />}
      </div>
    </div>
  );
};

export default FilterCategoriesInput;
