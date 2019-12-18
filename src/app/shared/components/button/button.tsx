import React from 'react';
import { Icon } from 'antd';

import './button.style.less';

type ButtonType = 'primary' | 'secondary';

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  buttonType: ButtonType;
  loading?: boolean;
  hasIcon?: boolean;
  iconType?: string;
}

const Button: React.FC<IProps> = ({ text, buttonType, loading = false, hasIcon = false, iconType, ...props }) => {
  return (
    <button className={`button button-${buttonType}`} {...props}>
      {text} {loading ? <Icon type="loading" className="button-icon" /> : hasIcon && <Icon type={iconType} className="button-icon" />}
    </button>
  );
};

export default Button;
