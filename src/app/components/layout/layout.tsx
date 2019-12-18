import React from 'react';

import './layout.style.less';

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <main className="layout">{children}</main>
    </>
  );
};

export default Layout;
