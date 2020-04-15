import React from 'react';
import { Tag as AntdTag } from 'antd';

import './tag.styles.less';

type TagColors = 'green' | 'black';

interface IProps extends React.HTMLAttributes<HTMLElement> {
  text: string;
  color: TagColors;
  isButton?: boolean;
  closable?: boolean;
  onClose?: (event?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const Tag: React.FC<IProps> = ({ text, color, isButton = false, closable, onClose, ...props }) => {
  return (
    <AntdTag onClose={onClose} closable={closable} {...props} className={`tag tag-${color} ${isButton ? 'pointer' : ''}`}>
      {text}
    </AntdTag>
  );
};

export default Tag;
