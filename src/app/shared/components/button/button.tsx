import React from 'react';

import './button.style.scss';

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

const Button: React.FC<IProps> = ({ text, ...props }) => {
  return (
    <button className="button" {...props}>
      {text}
    </button>
  );
};

export default Button;
