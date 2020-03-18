import React, { useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Icon, Dropdown, Menu, Button } from 'antd';

import { CurrentUserContext } from '../../providers/current-user/current-user.provider';
import { SearchContext } from '../../providers/search/search.provider';
import { logout } from '../../firebase/firebase.service';
import NotifContext from '../../contexts/notif/notif.context';

import './header.styles.less';

const Header: React.FC<RouteComponentProps<{}>> = ({ history }) => {
  const { currentUser } = useContext(CurrentUserContext);
  const { isSearchOpen, toggleSearch } = useContext(SearchContext);
  const { openNotification } = useContext(NotifContext);

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
          Sign out <Icon type="logout" />
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
        Hooks News
      </h2>
      <div>
        <span className="search" onClick={() => toggleSearch(!isSearchOpen)}>
          <Icon type={isSearchOpen ? 'close' : 'search'} className="search-icon" />
          {isSearchOpen ? 'Close' : 'Search'}
        </span>
        <div className="header-button">
          {currentUser ? (
            <Dropdown placement="bottomRight" overlay={menu} trigger={['click']}>
              <Button type="link">
                {currentUser.displayName} <Icon type="down" />
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
              Sign in <Icon type="login" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default withRouter(Header);
