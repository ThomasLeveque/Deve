import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Icon, Dropdown, Menu, Button } from 'antd';

import { CurrentUserContext } from '../../providers/current-user/current-user.provider';
import { logout } from '../../firebase/firebase.service';

import './header.styles.less';

const Header: React.FC<RouteComponentProps<{}>> = ({ history }) => {
  const { currentUser } = React.useContext(CurrentUserContext);

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <div className="pointer" onClick={logout}>
          Sign out
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="header">
      <h2 className="header-title pointer" onClick={() => history.push('/')}>
        Hooks News
      </h2>
      <div>
        <Icon type="search" className="search-icon" />
        <div className="header-button">
          {currentUser ? (
            <Dropdown placement="bottomRight" overlay={menu} trigger={['click']}>
              <Button type="link">
                {currentUser.displayName} <Icon type="down" />
              </Button>
            </Dropdown>
          ) : (
            <Button type="link" onClick={() => history.push('/signin')}>
              Sign in <Icon type="login" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default withRouter(Header);
