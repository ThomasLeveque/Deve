import React from 'react';
import { CategoriesContext } from '../../providers/categories/categories.provider';
import Category from '../../models/category.model';

import './filter-bar.styles.less';
import Tag from '../tag/tag.component';

const FilterBar: React.FC = () => {
  const { usedCategories, totalUsedCategories } = React.useContext(CategoriesContext);
  
  return (
    <div className="filter-bar">
      <h4>Filter by categories :</h4>
      <Tag text={`all (${totalUsedCategories})`} color="green" />
      {usedCategories.map((category: Category) => (
        <Tag isButton key={category.id} text={`${category.name} (${category.count})`} color="green" />
      ))}
    </div>
  );
};

export default FilterBar;
