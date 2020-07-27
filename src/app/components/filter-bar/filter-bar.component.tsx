import React, { useState } from 'react';
import { useQueryParam, ArrayParam } from 'use-query-params';

// Components
import Tag from '../tag/tag.component';
import FilterCategoriesInput from '../filter-categories-input/filter-categories-input.component';

// Others
import { useCategories } from '../../providers/categories/categories.provider';
import Category from '../../models/category.model';
import useDebounce from '../../hooks/debounce.hook';

import './filter-bar.styles.less';

const FilterBar: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const { usedCategories } = useCategories();
  const [qsCategories = [], setQsCategories] = useQueryParam<string[]>('categories', ArrayParam);
  const debouncedSearchValue = useDebounce(searchValue, 300);

  const handleFilterCategoriesSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(event.target.value);
  };

  const handleFilterCategoriesReset = () => {
    setSearchValue('');
  };

  const addQsCategories = (categoryName: string): string[] => {
    return [categoryName, ...qsCategories];
  };

  const removeQsCategories = (categoryName: string): string[] => {
    return qsCategories.filter((qsCategory: string) => qsCategory !== categoryName);
  };

  return (
    <div className="filter-bar">
      <div className="filter-bar-container">
        <h4>Filter by categories :</h4>
        <FilterCategoriesInput
          onFilterCategoriesReset={handleFilterCategoriesReset}
          onChange={handleFilterCategoriesSearch}
          value={searchValue}
          name="search"
          placeholder="Search a category..."
          type="text"
        />
        <Tag isButton text="all" color={qsCategories?.length ? 'black' : 'green'} onClick={() => setQsCategories([])} />
        {qsCategories &&
          qsCategories.map((categoryName: string) => {
            const category: Category = usedCategories[categoryName];
            return (
              <Tag
                onClick={() => setQsCategories(removeQsCategories(category.name))}
                isButton
                key={category.id}
                text={`${category.name} (${category.count})`}
                color="green"
              />
            );
          })}
        {Object.keys(usedCategories)
          .filter((categoryName: string) => categoryName.toLowerCase().includes(debouncedSearchValue.toLowerCase()))
          .map((categoryName: string) => {
            // Do not render a Tag component if the iterated category is selected
            const isCategorySelected = qsCategories.find((qsCategory: string) => qsCategory === categoryName);
            if (isCategorySelected) return;

            const category: Category = usedCategories[categoryName];
            return (
              <Tag
                onClick={() => setQsCategories(addQsCategories(category.name))}
                isButton
                key={category.id}
                text={`${category.name} (${category.count})`}
                color="black"
              />
            );
          })}
      </div>
    </div>
  );
};

export default FilterBar;
