import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Typography, Icon } from 'antd';

import UnderlineLink from '../underline-link/underline-link.component';

import './not-found.styles.less';

const NotFound = () => {
  const { Title } = Typography;
  const location = useLocation();

  return (
    <div className="not-found">
      <div>
        <Title level={1}>
          <code>{location.pathname}</code>Not Found
        </Title>
        <UnderlineLink type="insider" to="/" hasIcon iconType="home">
          Go back to home
        </UnderlineLink>
      </div>
    </div>
  );
};

export default NotFound;
