import { createContext } from 'react';
import { notification } from 'antd';

export type NotifType = 'success' | 'error' | 'info' | 'open';

interface INotifContext {
  openNotification: (message: string, description: string, type: NotifType) => void;
}

const openNotification = (message: string, description: string, type: NotifType) => {
  notification[type]({
    message,
    description,
    duration: 4,
    className: `ant-notification-${type}`
  });
};

const NotifContext = createContext<INotifContext>({ openNotification });

export default NotifContext;
