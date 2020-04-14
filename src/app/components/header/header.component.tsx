import React from 'react';
import { useHistory } from 'react-router-dom';
import { Dropdown, Menu, Button } from 'antd';
import { LogoutOutlined, CloseOutlined, SearchOutlined, DownOutlined, LoginOutlined } from '@ant-design/icons';

import { useCurrentUser } from '../../providers/current-user/current-user.provider';
import { useSearch } from '../../providers/search/search.provider';
import { logout } from '../../firebase/firebase.service';
import { useNotification } from '../../contexts/notif/notif.context';

import './header.styles.less';

const Header: React.FC = () => {
  const { currentUser } = useCurrentUser();
  const { isSearchOpen, toggleSearch } = useSearch();
  const { openNotification } = useNotification();
  const history = useHistory();

  const handleLogout = async (): Promise<void> => {
    try {
      logout();
    } catch (err) {
      console.error(err);
      openNotification('Cannot logout', 'Try again', 'error');
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <div className="pointer" onClick={handleLogout}>
          Sign out <LogoutOutlined />
        </div>
      </Menu.Item>
    </Menu>
  );

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
          {isSearchOpen ? 'Close' : 'Search'}
        </span>
        <div className="header-button">
          {currentUser ? (
            <Dropdown placement="bottomRight" overlay={menu} trigger={['click']}>
              <Button type="link">
                {currentUser.displayName} <DownOutlined />
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
            >
              Sign in <LoginOutlined />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
