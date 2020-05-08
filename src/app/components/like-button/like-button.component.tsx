import React from 'react';
import { motion } from 'framer-motion';
import { FireFilled, FireOutlined } from '@ant-design/icons';

import './like-button.styles.less';

interface LikeButtonProps {
  alreadyLiked: boolean;
  voteCount: number;
  onVote: () => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({ alreadyLiked, voteCount, onVote }) => {
  return (
    <motion.div whileTap={{ scale: 0.85 }} className={`${alreadyLiked ? 'liked' : ''} like-button pointer`} onClick={onVote}>
      {alreadyLiked ? <FireFilled className="icon" /> : <FireOutlined className="icon" />}
      <span className="count">{voteCount === 0 ? 'like' : voteCount}</span>
    </motion.div>
  );
};

export default LikeButton;
