import React from 'react';
import { withRouter, Link, RouteComponentProps } from 'react-router-dom';
import { Icon } from 'antd';

import './underline-link.styles.less';

type UnderlineLinkType = 'insider' | 'external';

interface IProps extends RouteComponentProps<{}> {
  type: UnderlineLinkType;
  to?: string;
  href?: string;
}

const UnderlineLink: React.FC<IProps> = ({ type, to, href, children }) => {
  if (type === 'insider') {
    return (
      <Link className="underline-link" to={to}>
        {children}
      </Link>
    );
  }

  return (
    <a className="underline-link" target="_blank" href={href}>
      {children}
      <Icon className="underline-link-icon" type="export" />
    </a>
  );
};

export default withRouter(UnderlineLink);
