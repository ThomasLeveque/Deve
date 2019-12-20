import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Icon, Row, Col, Typography, Tooltip } from 'antd';

import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import FirebaseContext from '../../firebase/firebase.context';
import { IVote } from '../../interfaces/vote.interface';
import { ILink } from '../../interfaces/link.interface';
import Tag from '../tag/tag';
import UnderlineLink from '../underline-link/underline-link';
import { getDomain } from '../../utils';

import './link-item.style.less';

interface IProps extends RouteComponentProps<{}> {
  link: ILink;
  showCount: boolean;
}

const LinkItem: React.FC<IProps> = ({ link, showCount = false, history }) => {
  const { firebase, user, openNotification } = React.useContext(FirebaseContext);
  const { Title } = Typography;
  const postedByAuthUser: boolean = user && user.id === link.postedBy.id;
  const alreadyLiked: boolean = !!link.votes.find((vote: IVote) => user && vote.voteBy.id === user.id);

  const handleVote = async (): Promise<void> => {
    if (!user) {
      history.push('/login');
    } else if (alreadyLiked) {
      openNotification('You already liked it !', '', 'info');
    } else {
      const voteRef: firebase.firestore.DocumentReference = firebase.db.collection('links').doc(link.id);

      const doc: firebase.firestore.DocumentSnapshot = await voteRef.get();
      if (doc.exists) {
        const previousVotes = doc.data().votes;
        const vote: IVote = {
          voteBy: { id: user.id, name: user.name }
        };
        const updatedVotes: IVote[] = [...previousVotes, vote];
        const voteCount = updatedVotes.length;
        voteRef.update({ votes: updatedVotes, voteCount });
      }
    }
  };

  // const handleDeleteLink = async (): Promise<void> => {
  //   const linkRef: firebase.firestore.DocumentReference = firebase.db.collection('links').doc(link.id);
  //   try {
  //     await linkRef.delete();
  //   } catch (err) {
  //     console.error('Error deleting document', err);
  //   }
  // };

  return (
    <Col span={6}>
      <div className="link-item">
        <div className="link-item-data">
          <div>
            {link.category && <Tag text={link.category} color="green" />}
            <Tooltip title={link.description}>
              <Title ellipsis={{ rows: 3 }} level={4}>
                {link.description}
              </Title>
            </Tooltip>
            <UnderlineLink type="external" href={link.url}>
              On {getDomain(link.url)}
            </UnderlineLink>
          </div>
          <Row type="flex" align="bottom" className="author light">
            <Col span={12} className="break-word">
              by {link.postedBy.name}
            </Col>
            <Col span={12} className="text-align-right">
              {distanceInWordsToNow(link.created)}
            </Col>
          </Row>
        </div>
        <div className="link-item-actions flex">
          <div className={alreadyLiked ? 'favorite pointer liked' : 'favorite pointer'} onClick={handleVote}>
            <Icon type="fire" theme={alreadyLiked ? 'filled' : 'outlined'} className="icon" />
            <span className="count">{link.voteCount === 0 ? 'like' : link.voteCount}</span>
          </div>
          <div className="comment pointer" onClick={() => history.push(`/link/${link.id}`)}>
            <Icon type="message" className="icon" />
            <span className="count">{link.comments.length} comments</span>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default withRouter(LinkItem);
