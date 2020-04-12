import React from 'react';
import { withRouter, Link, RouteComponentProps } from 'react-router-dom';
import { Icon } from 'antd';

import './underline-link.styles.less';

type UnderlineLinkType = 'insider' | 'external' | 'no-link-external';

interface IProps extends RouteComponentProps<{}> {
  type: UnderlineLinkType;
  to?: string;
  href?: string;
  iconType?: string;
  hasIcon?: boolean;
}

const UnderlineLink: React.FC<IProps> = ({ type, to, href, iconType = 'export', hasIcon = false, children }) => {
  if (type === 'insider') {
    return (
      <Link className="underline-link" to={to}>
        {children}
        {hasIcon && <Icon className="underline-link-icon" type={iconType} />}
      </Link>
    );
  }

  if (type === 'no-link-external') {
    return (
      <span className="underline-link">
        {children}
        <Icon className="underline-link-icon" type={iconType} />
      </span>
    );
  }

  return (
    <a className="underline-link" target="_blank" href={href}>
      {children}
      <Icon className="underline-link-icon" type={iconType} />
    </a>
  );
};

export default withRouter(UnderlineLink);
