import React from 'react';
import { Tabs } from 'antd';

import SignIn from '../../components/sign-in/sign-in.component';
import SignUp from '../../components/sign-up/sign-up.component';

import './sign-in-and-sign-up.styles.less';

const SignInAndSignUpPage: React.FC = () => {
  const { TabPane } = Tabs;

  return (
    <div className="sign-in-and-sign-up-page">
      <Tabs size="large" defaultActiveKey="1">
        <TabPane tab="Sign in" key="1">
          <SignIn />
        </TabPane>
        <TabPane tab="Sign up" key="0">
          <SignUp />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SignInAndSignUpPage;
