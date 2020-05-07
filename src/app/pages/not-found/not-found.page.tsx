import React from 'react';
import { useLocation } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

import UnderlineLink from '../../components/underline-link/underline-link.component';

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
        <UnderlineLink type="insider" to="/" hasIcon Icon={HomeOutlined}>
          Go back to home
        </UnderlineLink>
      </div>
    </div>
  );
};

export default NotFound;
