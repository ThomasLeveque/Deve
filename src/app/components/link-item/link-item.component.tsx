import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Icon, Row, Col, Typography, Tooltip } from 'antd';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import { useInView } from 'react-intersection-observer';
import { Spring } from 'react-spring/renderprops';

import Tag from '../tag/tag.component';
import UnderlineLink from '../underline-link/underline-link.component';

import { useLinks } from '../../providers/links/links.provider';
import { useCurrentUser } from '../../providers/current-user/current-user.provider';
import { IVote } from '../../interfaces/vote.interface';
import { getDomain, ITEMS_PER_LIGNE, LINKS_TRANSITION_DElAY } from '../../utils/index';
import { Link } from '../../models/link.model';

import './link-item.styles.less';

interface IProps extends RouteComponentProps<{}> {
  link: Link;
  index: number;
}

const LinkItem: React.FC<IProps> = ({ link, history, index }) => {
  const { currentUser } = useCurrentUser();
  const { updateVoteLinks } = useLinks();

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

  const [ref, inView] = useInView({
    threshold: 0.25,
    triggerOnce: true
  });

  return (
    <Spring
      to={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translate3d(0,0,0)' : 'translate3d(20px,0,0)'
      }}
      delay={(index % ITEMS_PER_LIGNE) * LINKS_TRANSITION_DElAY}
    >
      {props => (
        <div style={props} className="link-item" ref={ref}>
          <a className="link-item-data" href={link.url} target="_blank">
            <div>
              {link.category && <Tag text={link.category} color="green" />}
              <Tooltip title={link.description}>
                <Title ellipsis={{ rows: 3 }} level={4}>
                  {link.description}
                </Title>
              </Tooltip>
              <UnderlineLink type="no-link-external">On {getDomain(link.url)}</UnderlineLink>
            </div>
            <Row type="flex" align="bottom" className="author light P">
              <Col span={12} className="break-word P">
                by {link.postedBy.displayName}
              </Col>
              <Col span={12} className="text-align-right P">
                {distanceInWordsToNow(link.createdAt)} ago
              </Col>
            </Row>
          </a>
          <div className="link-item-actions flex">
            <div className={`${alreadyLiked ? 'liked' : ''} favorite pointer`} onClick={handleVote}>
              <Icon type="fire" theme={alreadyLiked ? 'filled' : 'outlined'} className="icon" />
              <span className="count">{link.voteCount === 0 ? 'like' : link.voteCount}</span>
            </div>
            <div className="comment pointer" onClick={() => history.push(`/links/${link.id}`)}>
              <Icon type="message" className="icon" />
              <span className="count">{`${link.comments.length} comment${link.comments.length > 1 ? 's' : ''}`}</span>
            </div>
          </div>
        </div>
      )}
    </Spring>
  );
};

export default withRouter(LinkItem);
