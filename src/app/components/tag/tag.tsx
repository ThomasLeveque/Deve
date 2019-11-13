import React from 'react';

import './tag.style.scss';

type TagColors = 'green' | 'black';

interface IProps {
  text: string;
  color: TagColors;
}

const Tag: React.FC<IProps> = ({ text, color }) => {
  return <span className={`tag tag-${color}`}>{text}</span>;
};

export default Tag;
