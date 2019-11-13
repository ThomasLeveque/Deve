import React from 'react';

import './tag.style.scss';

export enum TagColors {
  green = 'green',
  black = 'black'
}

interface IProps {
  text: string;
  color: TagColors;
}

const Tag: React.FC<IProps> = ({ text, color }) => {
  return <span className={`tag tag-${color}`}>{text}</span>;
};

export default Tag;
