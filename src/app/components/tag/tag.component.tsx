import React from 'react';

import './tag.styles.less';

type TagColors = 'green' | 'black';

interface IProps extends React.HTMLAttributes<HTMLElement> {
  text: string;
  color: TagColors;
  isButton?: boolean;
}

const Tag: React.FC<IProps> = ({ text, color, isButton, ...props }) => {
  return (
    <span {...props} className={`tag tag-${color} ${isButton ? 'pointer' : ''}`}>
      {text}
    </span>
  );
};

export default Tag;
