import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';

import './first-loading.styles.less';

const FirstLoading = () => (
  <div className="first-loading">
    <div>
      <h1>Deve</h1>
      <LoadingOutlined />
    </div>
  </div>
);

export default FirstLoading;
