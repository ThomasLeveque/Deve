import React from 'react';
import { useQueryParam, StringParam } from 'use-query-params';

import { CategoriesContext } from '../../providers/categories/categories.provider';
import Category from '../../models/category.model';
import './filter-bar.styles.less';
import Tag from '../tag/tag.component';

const FilterBar: React.FC = () => {
  const { usedCategories, totalUsedCategories } = React.useContext(CategoriesContext);
  const [qsCategory, setQsCategory] = useQueryParam('category', StringParam);

  return (
    <div className="filter-bar">
      <h4>Filter by categories :</h4>
      <Tag isButton text={`all (${totalUsedCategories})`} color={qsCategory ? 'black' : 'green'} onClick={() => setQsCategory('')} />
      {usedCategories.map((category: Category) => (
        <Tag
          onClick={() => setQsCategory(category.name)}
          isButton
          key={category.id}
          text={`${category.name} (${category.count})`}
          color={qsCategory === category.name ? 'green' : 'black'}
        />
      ))}
    </div>
  );
};

export default FilterBar;
