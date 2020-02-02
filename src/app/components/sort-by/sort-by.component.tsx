import React, { useState } from 'react';
import { connectSortBy } from 'react-instantsearch-dom';

import './sort-by.styles.less';
import { Dropdown, Button, Icon, Menu } from 'antd';

interface IItem {
  label: string;
  value: string;
  isRefined: boolean;
}

interface IProps {
  items: IItem[];
  refine: (value: string) => void;
  createURL: (value: string) => void;
  currentRefinement: string;
}

const SortBy: React.FC<IProps> = ({ items, refine, createURL, currentRefinement }) => {
  const menu = () => (
    <Menu>
      {items.map((item: IItem, index: number) => {
        return (
          <Menu.Item
            key={item.value}
            onClick={() => {
              refine(item.value);
            }}
          >
            {item.label}
          </Menu.Item>
        );
      })}
    </Menu>
  );

  const currentLabel = items.find((item: IItem) => item.value === currentRefinement);

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Button type="link">
        Sort by <span className="selected-filter">{`: ${currentLabel.label}`}</span>
        <Icon type="down" />
      </Button>
    </Dropdown>
  );
};

export default connectSortBy(SortBy);
