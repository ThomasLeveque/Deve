import React from 'react';
import { Icon } from 'antd';

import './custom-button.styles.less';

type CustomButtonType = 'primary' | 'secondary' | 'with-google';

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  buttonType: CustomButtonType;
  loading?: boolean;
  hasIcon?: boolean;
  iconType?: string;
}

const CustomButton: React.FC<IProps> = ({ text, buttonType, loading = false, hasIcon = false, iconType, ...props }) => {
  return (
    <button className={`custom-button custom-button-${buttonType}`} {...props}>
      {text}
      {loading ? (
        <Icon type="loading" className="custom-button-icon" />
      ) : (
        hasIcon && <Icon type={iconType} className="custom-button-icon" />
      )}
    </button>
  );
};

export default CustomButton;
