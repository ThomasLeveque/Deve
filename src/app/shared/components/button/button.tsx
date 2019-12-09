import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import './button.style.scss';

type ButtonType = 'primary' | 'secondary';

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  buttonType: ButtonType;
  loading?: boolean;
}

const Button: React.FC<IProps> = ({ text, buttonType, loading = false, ...props }) => {
  return (
    <button className={`button button-${buttonType}`} {...props}>
      {text} {loading && <CircularProgress className="button-loader" size={15} color="inherit" />}
    </button>
  );
};

export default Button;
