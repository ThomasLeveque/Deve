import React from 'react';
import { useHistory } from 'react-router-dom';
import { Dropdown, Menu, Button } from 'antd';
import { LogoutOutlined, CloseOutlined, SearchOutlined, DownOutlined, LoginOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'beautiful-react-hooks';

import { useCurrentUser } from '../../providers/current-user/current-user.provider';
import { useSearch } from '../../providers/search/search.provider';
import { IS_MOBILE } from '../../utils/constants.util';

import './header.styles.less';

const Header: React.FC = () => {
  const { currentUser, handleLogout } = useCurrentUser();
  const { isSearchOpen, toggleSearch } = useSearch();
  const history = useHistory();

  const isMobile = useMediaQuery(IS_MOBILE)

  const menu = (
    <Menu className="user-dropdown">
      <Menu.Item key="0">
        <div className="pointer" onClick={handleLogout}>
          <LogoutOutlined />
          Sign out
        </div>
      </Menu.Item>
    </Menu>
  );

  const renderUserName = (): string => {
    const { displayName } = currentUser;

    if (!isMobile) {
      return displayName;
    }

    const initialsName = displayName.split(' ').map((nameItem: string) => nameItem[0]);
    return initialsName.join('').toUpperCase();
  }

  return (
    <header className="header">
      <h2
        className="header-title pointer"
        onClick={() => {
          if (isSearchOpen) {
            toggleSearch(false);
          }
          history.push('/');
        }}
      >
        Deve
      </h2>
      <div>
        <span className="search" onClick={() => toggleSearch(!isSearchOpen)}>
          {isSearchOpen ? <CloseOutlined className="search-icon" /> : <SearchOutlined className="search-icon" />}
          {!isMobile && <span className="search-text">{isSearchOpen ? 'Close' : 'Search'}</span>}
        </span>
        <div className="header-button">
          {currentUser ? (
            <Dropdown placement="bottomRight" overlay={menu} trigger={['click']}>
              <Button type="link">
                {renderUserName()} <DownOutlined />
              </Button>
            </Dropdown>
          ) : (
            <Button
              type="link"
              onClick={() => {
                if (isSearchOpen) {
                  toggleSearch(false);
                }
                history.push('/signin');
              }}
              icon={<LoginOutlined />}
            >
              {!isMobile && 'Sign in'}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
