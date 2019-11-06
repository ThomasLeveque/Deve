import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';

import { FirebaseContext } from '../../firebase';

import './header.style.scss';

const Header: React.FC = () => {
  const { user, firebase } = React.useContext(FirebaseContext);
  return (
    <header className="header">
      <div className="flex">
        <h1 className="header-title">Hooks News</h1>
        <NavLink to="/new" className="header-link">
          new
        </NavLink>
        <NavLink to="/top" className="header-link">
          top
        </NavLink>
        <NavLink to="/search" className="header-link">
          search
        </NavLink>
        {user && (
          <NavLink to="/create" className="header-link">
            submit
          </NavLink>
        )}
      </div>
      <div className="flex">
        {user ? (
          <>
            <div className="header-name">{user.name}</div>
            <div>|</div>
            <div className="header-button pointer" onClick={() => firebase.logout()}>
              logout
            </div>
          </>
        ) : (
          <NavLink to="/login" className="header-link">
            login
          </NavLink>
        )}
      </div>
    </header>
  );
};

export default withRouter(Header);
