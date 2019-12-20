import React from 'react';
import { RouteComponentProps, match } from 'react-router-dom';

import FirebaseContext from '../firebase/firebase.context';
import LinkItem from '../components/link-item/link-item';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import { ILink } from '../interfaces/link.interface';
import { IComment } from '../interfaces/comment.interface';

type Params = { linkId: string };

interface IProps extends RouteComponentProps<{}> {
  match: match<Params>;
}

const LinkDetailPage: React.FC<IProps> = ({ match, history }) => {
  const { firebase, user } = React.useContext(FirebaseContext);

  const [link, setLink] = React.useState<ILink>(null);
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');
  const [commentText, setCommentText] = React.useState<string>('');

  const linkId: string = match.params.linkId;
  const linkRef: firebase.firestore.DocumentReference = firebase.db.collection('links').doc(linkId);

  React.useEffect(() => {
    const unsubcribe = linkRef.onSnapshot(handleSnapshot, handleError);
    return () => unsubcribe();
  }, []);

  const handleSnapshot = (doc: firebase.firestore.DocumentSnapshot) => {
    const link: ILink | any = { ...doc.data(), id: doc.id };
    setLink(link);
    setIsLoaded(true);
  };

  const handleError = (err: any) => {
    setError(err.message || err.toString());
    setIsLoaded(true);
  };

  const handleAddComment = async () => {
    if (!user) {
      history.push('/login');
    } else {
      const doc: firebase.firestore.QueryDocumentSnapshot = await linkRef.get();
      if (doc.exists) {
        const previousComments = doc.data().comments;
        const comment = {
          postedBy: { id: user.id, name: user.name },
          created: Date.now(),
          text: commentText
        };
        const updatedComments = [...previousComments, comment];
        await linkRef.update({ comments: updatedComments });
        setCommentText('');
      }
    }
  };

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  return (
    <div className="page">
      <LinkItem showCount={false} link={link} />
      <textarea
        rows={6}
        cols={60}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setCommentText(event.target.value)}
        value={commentText}
      />
      <div>
        <button onClick={handleAddComment} className="button">
          Add Comment
        </button>
      </div>
      {link.comments.map((comment: IComment, index: number) => (
        <div key={index}>
          <p className="comment-author">
            {comment.postedBy.name} | {distanceInWordsToNow(comment.created)}
          </p>
          <p>{comment.text}</p>
        </div>
      ))}
    </div>
  );
};

export default LinkDetailPage;
