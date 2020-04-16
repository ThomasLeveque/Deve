import React from 'react';
import { Link } from 'react-router-dom';
import { ExportOutlined } from '@ant-design/icons';

import './underline-link.styles.less';

type UnderlineLinkType = 'insider' | 'external' | 'not-link-external';

interface IProps {
  type: UnderlineLinkType;
  to?: string;
  href?: string;
  Icon?: any;
  hasIcon?: boolean;
}

const UnderlineLink: React.FC<IProps> = ({ type, to, href, Icon = ExportOutlined, hasIcon = false, children }) => {
  if (type === 'insider') {
    return (
      <Link className="underline-link" to={to}>
        {children}
        {hasIcon && <Icon className="underline-link-icon" />}
      </Link>
    );
  }

  if (type === 'not-link-external') {
    return (
      <span className="underline-link">
        {children}
        <Icon className="underline-link-icon" />
      </span>
    );
  }

  return (
    <a className="underline-link" target="_blank" href={href}>
      {children}
      <Icon className="underline-link-icon" />
    </a>
  );
};

export default UnderlineLink;
