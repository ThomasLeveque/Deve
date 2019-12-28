import React, { useMemo, useCallback } from 'react';
import ContentLoader from 'react-content-loader';

import { getRandomInt } from '../../utils/index';

import './placeholder.style.less';

const Placeholder = (props: any) => {
  const width1 = useMemo(() => getRandomInt(100, 330), []);
  const width2 = useMemo(() => getRandomInt(100, 330), []);
  const width3 = useMemo(() => getRandomInt(100, 330), []);

  return (
    <div className="placeholder">
      <div>
        <ContentLoader height={60} width={400} speed={2} primaryColor="#f1f3f7" secondaryColor="#e6e8ec" {...props}>
          <rect x="70" y="10" rx="4" ry="4" width={width1} height="5" />
          <rect x="70" y="28" rx="3" ry="3" width={width2} height="5" />
          <rect x="70" y="46" rx="3" ry="3" width={width3} height="5" />
          <circle cx="30" cy="30" r="30" />
        </ContentLoader>
      </div>
    </div>
  );
};

export default Placeholder;
