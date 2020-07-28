import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Dropdown, Space, Button, Menu } from 'antd';
import { DownOutlined, PlusOutlined, CloseOutlined, FilterOutlined, FilterFilled, ClearOutlined } from '@ant-design/icons';
import { useQueryParam, StringParam, ArrayParam } from 'use-query-params';
import { useMediaQuery } from 'beautiful-react-hooks';
import { AnimatePresence, motion } from 'framer-motion';

// Components
import LinkList from '../../components/link-list/link-list.component';
import FilterBar from '../../components/filter-bar/filter-bar.component';
import CustomButton from '../../components/custom-button/custom-button.component';

// Others
import { useSearch } from '../../providers/search/search.provider';

// Others
import { IS_RESPONSIVE, HOVER_EASING, PAGE_EASING } from '../../utils/constants.util';

import './home.styles.less';

const HomePage: React.FC = () => {
  const isResponsive = useMediaQuery(IS_RESPONSIVE);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(!isResponsive);
  const [qsSortby, setQsSortby] = useQueryParam('sortby', StringParam);
  const [qsCategories = [], setQsCategories] = useQueryParam<string[]>('categories', ArrayParam);
  const history = useHistory();
  const { isSearchOpen } = useSearch();

  const sortByMapping: { [key: string]: { text: string } } = {
    recent: {
      text: 'Most recent'
    },
    liked: {
      text: 'Most liked'
    },
    oldest: {
      text: 'Oldest'
    }
  };

  const toggleFilterOpen = (): void => {
    setIsFilterOpen((prevIsFilterOpen => !prevIsFilterOpen))
  };

  useEffect(() => {
    setIsFilterOpen(!isResponsive);
  }, [isResponsive]);

  useEffect(() => {
    if (isSearchOpen && isFilterOpen) {
      setIsFilterOpen(false);
    }
  }, [isSearchOpen]);

  const menu = () => (
    <Menu>
      {Object.keys(sortByMapping).map((sortby: string, index: number) => {
        return (
          <Menu.Item key={`${index}`} onClick={() => setQsSortby(sortby)}>
            {sortByMapping[sortby].text}
          </Menu.Item>
        );
      })}
    </Menu>
  );

  return (
    <div className="home-page">
      <AnimatePresence exitBeforeEnter initial={false}>
        {isFilterOpen && (
          <>
            <FilterBar />
            {isResponsive && <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: PAGE_EASING }}
              onClick={toggleFilterOpen}
              className="filter-bar-overlay" />}
          </>
        )}
      </AnimatePresence>
      <div className="home-page-top">
        <Dropdown overlay={menu} trigger={['click']}>
          <Button type="link">
            Sort by{qsSortby && <span className="selected-filter">{`: ${sortByMapping[qsSortby].text}`}</span>}
            <DownOutlined />
          </Button>
        </Dropdown>
        <CustomButton text="Add a link" buttonType="primary" hasIcon Icon={PlusOutlined} onClick={() => history.push('add')} />
      </div>
      <LinkList />
      {isResponsive && <div className="toggle-filter">
        <Space direction="vertical">
          <AnimatePresence exitBeforeEnter initial={false}>
            {qsCategories.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.6, ease: HOVER_EASING }}
              >
                <Button
                  onClick={() => setQsCategories([])}
                  type="primary"
                  shape="circle"
                  icon={<ClearOutlined />}
                  size="large"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            onClick={toggleFilterOpen}
            type="primary"
            shape="circle"
            icon={isFilterOpen ? <CloseOutlined /> : qsCategories.length > 0 ? <FilterFilled /> : <FilterOutlined />}
            size="large"
          />
        </Space>
      </div>}
    </div>
  );
};

export default HomePage;
