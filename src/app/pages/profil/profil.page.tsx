import React from 'react';
import { motion } from 'framer-motion';
import { useHistory } from 'react-router-dom';
import { PageHeader, Descriptions, Avatar, Switch, Image } from 'antd';
import { UserOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { distanceInWordsToNow } from 'date-fns';

import { useCurrentUser } from '../../providers/current-user/current-user.provider';
import { SLIDE_ROUTE, PAGE_EASING } from '../../utils/constants.util';

import './profil.styles.less';

const ProfilPage: React.FC = () => {
  const { currentUser } = useCurrentUser();
  const history = useHistory();

  return (
    <motion.div
      className="profil-page"
      initial={{ opacity: 0, x: SLIDE_ROUTE }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: PAGE_EASING }}
    >
      <PageHeader onBack={history.goBack} title={<h2>Your profil</h2>} />
      <div className="profil-page-container">
        <Descriptions title="User Info" layout="vertical" size="small">
          <Descriptions.Item labelStyle={{ marginTop: 10 }} label="Profile picture">
            {currentUser.photoURL ? (
              <Avatar size={50} src={<Image src={currentUser.photoURL} />} />
            ) : (
              <Avatar size={50} icon={<UserOutlined />} />
            )}
          </Descriptions.Item>
          <Descriptions.Item labelStyle={{ marginTop: 10 }} label="Username">
            <h4>{currentUser.displayName}</h4>
          </Descriptions.Item>
          <Descriptions.Item labelStyle={{ marginTop: 10 }} label="Email">
            <h4>{currentUser.email}</h4>
          </Descriptions.Item>
          <Descriptions.Item labelStyle={{ marginTop: 10 }} label="Admin status">
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              defaultChecked={currentUser.isAdmin}
              disabled
            />
          </Descriptions.Item>
          <Descriptions.Item labelStyle={{ marginTop: 10 }} label="Created at">
            <h4>{distanceInWordsToNow(currentUser.createdAt)} ago</h4>
          </Descriptions.Item>
          <Descriptions.Item labelStyle={{ marginTop: 10 }} label="Updated at">
            <h4>{distanceInWordsToNow(currentUser.updatedAt)} ago</h4>
          </Descriptions.Item>
        </Descriptions>
      </div>
    </motion.div>
  );
};

export default ProfilPage;
