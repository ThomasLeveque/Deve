import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

import { HOVER_EASING } from '../../utils/constants.util';

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
    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.6, ease: HOVER_EASING }}>
      <button className={`custom-button custom-button-${buttonType}`} {...props}>
        {text}
        {loading ? <LoadingOutlined className="custom-button-icon" /> : hasIcon && <Icon className="custom-button-icon" />}
      </button>
    </motion.div>
  );
};

export default CustomButton;
