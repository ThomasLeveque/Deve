import React from 'react';

import './layout.style.scss';

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <main className="layout">{children}</main>
    </>
  );
};

export default Layout;
