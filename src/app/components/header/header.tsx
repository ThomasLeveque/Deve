import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Icon, Dropdown, Menu, Button } from 'antd';

import { FirebaseContext } from '../../firebase';

import './header.style.less';

const Header: React.FC<RouteComponentProps<{}>> = ({ history }) => {
  const { user, firebase } = React.useContext(FirebaseContext);
  const menu = (
    <Menu>
      <Menu.Item key="0">
        <div className="pointer" onClick={() => firebase.logout()}>
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
      {user ? (
        <Dropdown placement="bottomRight" overlay={menu} trigger={['click']}>
          <Button type="link">
            {user.name} <Icon type="down" />
          </Button>
        </Dropdown>
      ) : (
        <Button type="link" onClick={() => history.push('/login')}>
          Sign in <Icon type="login" />
        </Button>
      )}
    </header>
  );
};

export default withRouter(Header);
