import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Dropdown, Button, Menu } from 'antd';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryParam, StringParam } from 'use-query-params';

import LinkList from '../../components/link-list/link-list.component';
import FilterBar from '../../components/filter-bar/filter-bar.component';
import CustomButton from '../../components/custom-button/custom-button.component';

import './home.styles.less';
import firebaseApp, { firestore } from '../../firebase/firebase.service';
import { Link } from '../../models/link.model';

const HomePage: React.FC = () => {
  const [qsSortby, setQsSortby] = useQueryParam('sortby', StringParam);
  const history = useHistory();

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
      <FilterBar />
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
    </div>
  );
};

export default HomePage;
