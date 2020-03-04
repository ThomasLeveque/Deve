import React, { useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Icon, Row, Col, Typography, Tooltip } from 'antd';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import { useInView } from 'react-intersection-observer';
import { Spring } from 'react-spring/renderprops';

import NotifContext from '../../contexts/notif/notif.context';
import { firestore } from '../../firebase/firebase.service';

import Tag from '../tag/tag.component';
import UnderlineLink from '../underline-link/underline-link.component';

import { CurrentUserContext } from '../../providers/current-user/current-user.provider';
import { IVote } from '../../interfaces/vote.interface';
import { getDomain } from '../../utils';
import { ITEMS_PER_LIGNE, LINKS_TRANSITION_DElAY } from '../../utils/index';
import { Link } from '../../models/link.model';

import './link-item.styles.less';

interface IProps extends RouteComponentProps<{}> {
  link: Link;
  index: number;
}

const LinkItem: React.FC<IProps> = ({ link, history, index }) => {
  const { currentUser } = useContext(CurrentUserContext);
  const { openNotification } = useContext(NotifContext);

  const { Title } = Typography;
  const postedByAuthUser: boolean = currentUser && currentUser.id === link.postedBy.id;
  const alreadyLiked: boolean = !!link.votes.find((vote: IVote) => currentUser && vote.voteBy.id === currentUser.id);

  const handleVote = async (): Promise<void> => {
    if (!currentUser) {
      history.push('/signin');
    } else if (alreadyLiked) {
      openNotification('You already liked it !', '', 'info');
    } else {
      const voteRef: firebase.firestore.DocumentReference = firestore.collection('links').doc(link.id);

      const doc: firebase.firestore.DocumentSnapshot = await voteRef.get();
      if (doc.exists) {
        const previousVotes = doc.data().votes;
        const { id, displayName } = currentUser;
        const vote: IVote = {
          voteBy: { id, displayName }
        };
        const updatedVotes: IVote[] = [...previousVotes, vote];
        const voteCount = updatedVotes.length;
        voteRef.update({ votes: updatedVotes, voteCount });
      }
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
            <Row type="flex" align="bottom" className="author light">
              <Col span={12} className="break-word">
                by {link.postedBy.displayName}
              </Col>
              <Col span={12} className="text-align-right">
                {distanceInWordsToNow(link.createdAt)}
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
              <span className="count">{link.comments.length} comments</span>
            </div>
          </div>
        </div>
      )}
    </Spring>
  );
};

export default withRouter(LinkItem);
