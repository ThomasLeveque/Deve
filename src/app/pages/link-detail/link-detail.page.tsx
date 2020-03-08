import React, { useContext } from 'react';
import { RouteComponentProps, match } from 'react-router-dom';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import { PageHeader, Row, Col, Icon, Divider } from 'antd';
import { Formik, Form, FormikHelpers, FormikProps, Field } from 'formik';

import { CurrentUserContext } from '../../providers/current-user/current-user.provider';
import { firestore } from '../../firebase/firebase.service';
import { IComment } from '../../interfaces/comment.interface';
import Tag from '../../components/tag/tag.component';
import Loading from '../../components/loading/loading.component';
import { Link } from '../../models/link.model';
import CustomButton from '../../components/custom-button/custom-button.component';
import { FormInput } from '../../components/form-input/form-input.component';
import { IAddCommentInitialState } from '../../interfaces/initial-states.type';
import { commentSchema } from '../../schemas/link.schema';

import './link-detail.styles.less';

type Params = { linkId: string };

interface IProps extends RouteComponentProps<{}> {
  match: match<Params>;
}

const INITIAL_STATE: IAddCommentInitialState = {
  commentText: ''
};

const LinkDetailPage: React.FC<IProps> = ({ match, history }) => {
  const { currentUser } = useContext(CurrentUserContext);

  const [link, setLink] = React.useState<Link>(null);
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');

  const linkId: string = match.params.linkId;
  const linkRef: firebase.firestore.DocumentReference = firestore.collection('links').doc(linkId);

  React.useEffect(() => {
    const unsubcribe = linkRef.onSnapshot(handleSnapshot, handleError);
    return () => unsubcribe();
  }, [linkId]);

  const handleSnapshot = (doc: firebase.firestore.DocumentSnapshot) => {
    const link: Link = new Link(doc);
    setLink(link);
    setIsLoaded(true);
  };

  const handleError = (err: any) => {
    setError(err.message || err.toString());
    setIsLoaded(true);
  };

  const handleAddComment = async ({ commentText }: IAddCommentInitialState) => {
    if (!currentUser) {
      history.push('/signin');
    } else {
      const doc: firebase.firestore.QueryDocumentSnapshot = await linkRef.get();
      if (doc.exists) {
        const previousComments = doc.data().comments;
        const comment = {
          postedBy: { id: currentUser.id, displayName: currentUser.displayName },
          created: Date.now(),
          text: commentText
        };
        const updatedComments = [...previousComments, comment];
        await linkRef.update({ comments: updatedComments });
      }
    }
  };

  if (!isLoaded) {
    return <Loading />;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  return (
    <div className="link-detail-page">
      <PageHeader onBack={history.goBack} title={<h1 className="H2">Link detail</h1>} />
      <div className="link-detail-container">
        <div className="link-detail-top">
          <h1 className="H3">{link.description}</h1>
          <Tag text={link.category} color="green" />
        </div>
        <Row type="flex" align="bottom" className="author light P">
          <Col span={12} className="break-word P">
            by {link.postedBy.displayName}
          </Col>
          <Col span={12} className="text-align-right P">
            {distanceInWordsToNow(link.createdAt)} ago
          </Col>
        </Row>
        <div className="favorite pointer">
          <Icon type="fire" theme="outlined" className="icon" />
          <span className="count">{link.voteCount === 0 ? 'like' : link.voteCount}</span>
        </div>

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
            {({ isSubmitting, isValid, setFieldValue }: FormikProps<IAddCommentInitialState>) => {
              return (
                <Form>
                  <Field
                    autoComplete="off"
                    name="commentText"
                    placeholder="Add new comment"
                    type="text"
                    isTextarea
                    component={FormInput}
                  />
                  <CustomButton
                    type="button"
                    text="Reset"
                    buttonType="secondary"
                    hasIcon
                    iconType="close-circle"
                    onClick={() => setFieldValue('commentText', '', false)}
                  />
                  <CustomButton
                    type="submit"
                    text="Add Comment"
                    buttonType="primary"
                    loading={isSubmitting}
                    disabled={isSubmitting || !isValid}
                  />
                </Form>
              );
            }}
          </Formik>

          {link.comments.map((comment: IComment, index: number) => (
            <div key={index}>
              <Divider />
              <h4 className="comment-author">
                {comment.postedBy.displayName} <span>{distanceInWordsToNow(comment.created)} ago</span>
              </h4>
              <p className="comment-text">{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LinkDetailPage;
