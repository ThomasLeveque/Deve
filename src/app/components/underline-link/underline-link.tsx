import React from 'react';
import { withRouter, Link, RouteComponentProps } from 'react-router-dom';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import './underline-link.style.scss';

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
      <ExitToAppIcon className="underline-link-icon" color="inherit" />
    </a>
  );
};

export default withRouter(UnderlineLink);
