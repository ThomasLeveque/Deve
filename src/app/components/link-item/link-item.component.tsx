import React, { memo } from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Col, Typography, Tooltip } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { useQueryParam, ArrayParam } from 'use-query-params';

// Components
import Tag from '../tag/tag.component';
import UnderlineLink from '../underline-link/underline-link.component';
import LikeButton from '../like-button/like-button.component';

// Others
import { useLinks } from '../../providers/links/links.provider';
import { useCurrentUser } from '../../providers/current-user/current-user.provider';
import { IVote } from '../../interfaces/vote.interface';
import { GLOBAL_GRID_SIZE, LINKS_TRANSITION_DElAY } from '../../utils/constants.util';
import { Link } from '../../models/link.model';
import { getDomain } from '../../utils/format-string.util';

import './link-item.styles.less';

interface IProps {
  link: Link;
  index: number;
  columnSize: number;
}

const LinkItem: React.FC<IProps> = memo(({ link, index, columnSize }) => {
  const { currentUser } = useCurrentUser();
  const { updateVoteLinks } = useLinks();
  const [qsCategories, setQsCategories] = useQueryParam<string[]>('categories', ArrayParam);

  const history = useHistory();
  const { Title } = Typography;
  const alreadyLiked: boolean = !!link.votes.find((vote: IVote) => currentUser && vote.voteBy.id === currentUser.id);

  const handleVote = async (): Promise<void> => {
    if (!currentUser) {
      history.push('/signin');
    } else if (alreadyLiked) {
      updateVoteLinks(link.id, currentUser, 'remove');
    } else {
      updateVoteLinks(link.id, currentUser, 'add');
    }
  };

  const handleSelectCategory = (category: string, event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    event.preventDefault();
    setQsCategories([category]);
  };

  const [ref, inView] = useInView({
    threshold: 0.25,
    triggerOnce: true
  });

  const itemDelay: number = (index % (GLOBAL_GRID_SIZE / columnSize)) * LINKS_TRANSITION_DElAY;
  
  return (
    <motion.div
      transition={{ delay: itemDelay, ease: 'easeOut' }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : 20 }}
      className="link-item"
      whileHover={{ scale: 1.02, transition: { duration: 0.2, ease: 'easeOut' } }}
      ref={ref}
    >
      <a className="link-item-data" href={link.url} target="_blank">
        <div>
          {link.categories.length > 0 && (
            <Tooltip title="You can now filter by categories by clicking those tags" placement="topLeft">
              <div className="tags">
                {link.categories.map((category: string, index: number) => (
                  <Tag
                    onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => handleSelectCategory(category, event)}
                    isButton
                    key={`${category}${index}`}
                    text={category}
                    color="green"
                  />
                ))}
              </div>
            </Tooltip>
          )}
          <Tooltip title={link.description} placement="topLeft">
            <Title ellipsis={{ rows: 3 }} level={4}>
              {link.description}
            </Title>
          </Tooltip>
          <UnderlineLink type="not-link-external">On {getDomain(link.url)}</UnderlineLink>
        </div>
        <Row align="bottom" className="author light P">
          <Col span={12} className="break-word P">
            by {link.postedBy.displayName}
          </Col>
          <Col span={12} className="text-align-right P">
            {distanceInWordsToNow(link.createdAt)} ago
          </Col>
        </Row>
      </a>
      <div className="link-item-actions flex">
        <LikeButton alreadyLiked={alreadyLiked} voteCount={link.voteCount} onVote={handleVote} />
        <div className="comment pointer" onClick={() => history.push(`/links/${link.id}`)}>
          <MessageOutlined className="icon" />
          <span className="count">{`${link.commentCount} comment${link.commentCount > 1 ? 's' : ''}`}</span>
        </div>
      </div>
    </motion.div>
  );
});

export default LinkItem;
