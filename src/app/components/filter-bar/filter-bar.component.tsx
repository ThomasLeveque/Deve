import React from 'react';
import { useQueryParam, ArrayParam } from 'use-query-params';

import Tag from '../tag/tag.component';

import { useCategories } from '../../providers/categories/categories.provider';
import Category from '../../models/category.model';

import './filter-bar.styles.less';

const FilterBar: React.FC = () => {
  const { usedCategories } = useCategories();
  const [qsCategories = [], setQsCategories] = useQueryParam<string[]>('categories', ArrayParam);

  const updateQsCategories = (categoryName: string): string[] => {
    const isCategorySelected = qsCategories.find((qsCategory: string) => qsCategory === categoryName);

    if (!isCategorySelected) {
      return [...qsCategories, categoryName];
    } else {
      return qsCategories.filter((qsCategory: string) => qsCategory !== categoryName);
    }
  };

  return (
    <div className="filter-bar">
      <h4>Filter by categories :</h4>
      <Tag isButton text="all" color={qsCategories?.length ? 'black' : 'green'} onClick={() => setQsCategories([])} />
      {usedCategories.map((category: Category) => (
        <Tag
          onClick={() => setQsCategories(updateQsCategories(category.name))}
          isButton
          key={category.id}
          text={`${category.name} (${category.count})`}
          color={!!qsCategories?.find((_category: string) => _category === category.name) ? 'green' : 'black'}
        />
      ))}
    </div>
  );
};

export default FilterBar;
