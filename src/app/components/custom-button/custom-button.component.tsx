import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';

import './custom-button.styles.less';

type CustomButtonType = 'primary' | 'secondary' | 'with-google';

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  buttonType: CustomButtonType;
  loading?: boolean;
  hasIcon?: boolean;
  Icon?: any;
}

const CustomButton: React.FC<IProps> = ({ text, buttonType, loading = false, hasIcon = false, Icon, ...props }) => {
  return (
    <button className={`custom-button custom-button-${buttonType}`} {...props}>
      {text}
      {loading ? <LoadingOutlined className="custom-button-icon" /> : hasIcon && <Icon className="custom-button-icon" />}
    </button>
  );
};

export default CustomButton;
