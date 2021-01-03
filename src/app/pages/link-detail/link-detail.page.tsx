import React, { Fragment, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import { PageHeader, Row, Col, Divider, Space, Tooltip } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Formik, Form, FormikHelpers, FormikProps, Field } from 'formik';
import { motion } from 'framer-motion';
import { DocumentSnapshot, QuerySnapshot } from '@firebase/firestore-types';

// Components
import Loading from '../../components/loading/loading.component';
import CustomButton from '../../components/custom-button/custom-button.component';
import Tag from '../../components/tag/tag.component';
import { FormInput } from '../../components/form-input/form-input.component';
import LikeButton from '../../components/like-button/like-button.component';
import UnderlineLink from '../../components/underline-link/underline-link.component';

// Others
import { useCurrentUser } from '../../providers/current-user/current-user.provider';
import { firestore } from '../../firebase/firebase.service';
import { Link } from '../../models/link.model';
import { IAddCommentInitialState } from '../../interfaces/initial-states.type';
import { commentSchema } from '../../schemas/link.schema';
import { IVote } from '../../interfaces/vote.interface';
import { useLinks } from '../../providers/links/links.provider';
import { getDomain } from '../../utils/format-string.util';
import { useNotification } from '../../contexts/notif/notif.context';
import { SLIDE_ROUTE, PAGE_EASING } from '../../utils/constants.util';
import { Comment } from '../../models/comment.model';

import './link-detail.styles.less';

interface CommentsMap {
  [id: string]: Comment;
}

const INITIAL_STATE: IAddCommentInitialState = {
  commentText: ''
};

const LinkDetailPage: React.FC = () => {
  const { currentUser } = useCurrentUser();
  const { openNotification } = useNotification();
  const { updateVoteLinks, addCommentLink } = useLinks();
  const { linkId } = useParams<{ linkId: string }>();
  const history = useHistory();

  const [link, setLink] = React.useState<Link>(null);
  const [comments, setComments] = React.useState<CommentsMap>(null);
  const [isLinkLoaded, setIsLinkLoaded] = React.useState<boolean>(false);
  const [isCommentsLoaded, setIsCommentsLoaded] = React.useState<boolean>(false);

  const alreadyLiked: boolean = !!(link && link.votes.find((vote: IVote) => currentUser && vote.voteBy.id === currentUser.id));
  const linkRef = firestore.collection('links').doc(linkId);
  const commentsRef = firestore
    .collection('links')
    .doc(linkId)
    .collection('comments')
    .orderBy('createdAt', 'desc');

  useEffect(() => {
    const unsubcribeLink = linkRef.onSnapshot(handleLinkSnapshot, handleLinkError);
    const unsubcribeComments = commentsRef.onSnapshot(handleCommentsSnapshot, handleCommentsError);
    return () => {
      unsubcribeLink();
      unsubcribeComments();
    };
  }, [linkId]);

  const handleLinkSnapshot = (doc: DocumentSnapshot) => {
    const link: Link = new Link(doc);
    setLink(link);
    setIsLinkLoaded(true);
  };

  const handleLinkError = (err: any) => {
    openNotification(`Cannot load this link`, 'Try to reload', 'error');
    console.error(err);
    setIsLinkLoaded(true);
  };

  const handleCommentsSnapshot = ({ docs }: QuerySnapshot) => {
    const comments: CommentsMap = {};
    docs.map(doc => (comments[doc.id] = new Comment(doc)));
    setComments(comments);
    setIsCommentsLoaded(true);
  };

  const handleCommentsError = (err: any) => {
    openNotification(`Cannot load this comments`, 'Try to reload', 'error');
    console.error(err);
    setIsCommentsLoaded(true);
  };

  const handleVote = async (): Promise<void> => {
    if (!currentUser) {
      history.push('/signin');
    } else if (alreadyLiked) {
      updateVoteLinks(link.id, currentUser, 'remove');
    } else {
      updateVoteLinks(link.id, currentUser, 'add');
    }
  };

  const handleAddComment = async ({ commentText }: IAddCommentInitialState) => {
    if (!currentUser) {
      history.push('/signin');
    } else {
      addCommentLink(commentText, link.id, currentUser);
    }
  };

  const handleSelectedCategory = (category: string): void => {
    history.push(`/?categories=${category}`);
  };

  if (!isLinkLoaded) {
    return <Loading />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: SLIDE_ROUTE }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: PAGE_EASING }}
      className="link-detail-page"
    >
      <PageHeader onBack={history.goBack} title={<h2>Link detail</h2>} />
      <div className="link-detail-container">
        <div className="link-detail-top">
          <a className="link-detail-top-link" href={link.url} target="_blank">
            <h1 className="H3">{link.description}</h1>
            <UnderlineLink type="not-link-external">On {getDomain(link.url)}</UnderlineLink>
          </a>

          {link.categories.length > 0 && (
            <Tooltip title="You can now filter by categories by clicking those tags" placement="topRight">
              <div className="tags">
                {link.categories.map((category: string, index: number) => (
                  <Tag
                    isButton
                    onClick={() => handleSelectedCategory(category)}
                    key={`${category}${index}`}
                    text={category}
                    color="green"
                  />
                ))}
              </div>
            </Tooltip>
          )}
        </div>
        <Row align="bottom" className="author light P">
          <Col span={12} className="break-word P">
            by {link.postedBy.displayName}
          </Col>
          <Col span={12} className="text-align-right P">
            {distanceInWordsToNow(link.createdAt)} ago
          </Col>
        </Row>
        <LikeButton alreadyLiked={alreadyLiked} voteCount={link.voteCount} onVote={handleVote} />

        <div className="link-detail-comments">
          <Formik
            enableReinitialize
            initialValues={INITIAL_STATE}
            validationSchema={commentSchema}
            onSubmit={async (values: IAddCommentInitialState, { setSubmitting, setFieldValue }: FormikHelpers<IAddCommentInitialState>) => {
              await handleAddComment(values);
              setFieldValue('commentText', '', false);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, isValid, resetForm }: FormikProps<IAddCommentInitialState>) => {
              return (
                <Form>
                  <Field autoComplete="off" name="commentText" placeholder="Add new comment" type="text" isTextarea component={FormInput} />
                  <Space size="middle">
                    <CustomButton
                      type="button"
                      text="Reset"
                      buttonType="secondary"
                      hasIcon
                      Icon={CloseCircleOutlined}
                      onClick={() => resetForm()}
                    />
                    <CustomButton
                      type="submit"
                      text="Add Comment"
                      buttonType="primary"
                      loading={isSubmitting}
                      disabled={isSubmitting || !isValid}
                    />
                  </Space>
                </Form>
              );
            }}
          </Formik>

          {isCommentsLoaded && link.commentCount > 0 && (
            <div className="comment-list">
              {Object.keys(comments).map((commentId: string, index: number) => {
                const comment = comments[commentId];
                return (
                  <Fragment key={index}>
                    <Divider />
                    <h4 className="comment-author">
                      {comment.postedBy.displayName} <span>{distanceInWordsToNow(comment.createdAt)} ago</span>
                    </h4>
                    <p className="comment-text">{comment.text}</p>
                  </Fragment>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LinkDetailPage;
