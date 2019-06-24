import React from "react";
import FirebaseContext from "../../firebase/context";
import LinkItem from "./LinkItem";
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';

function LinkDetail(props) {
  const { firebase, user } = React.useContext(FirebaseContext);
  const [link, setLink] = React.useState(null);
  const [commentText, setCommentText] = React.useState('');
  const linkId = props.match.params.linkId;
  const linkRef = firebase.db.collection('links').doc(linkId);

  React.useEffect(() => {
    getLink();
  }, [])

  const getLink = async () => {
    const doc = await linkRef.get();
    setLink({ ...doc.data(), id: doc.id })
  }

  const handleAddComment = async () => {
    if(!user) {
      props.history.push('/login');
    } else {
      const doc = await linkRef.get();
      if(doc.exists) {
        const previousComments = doc.data().comments;
        const comment = {
          postedBy: { id: user.uid, name: user.displayName },
          created: Date.now(),
          text: commentText
        }
        const updatedComments = [...previousComments, comment];
        await linkRef.update({comments: updatedComments});
        setLink(prevState => ({
          ...prevState,
          comments: updatedComments
        }))
        setCommentText('');
      }
    }
  }

  return !link ? (
    <div>...loading</div>
  ) : (
    <div>
      <LinkItem showCount={false} link={link}/>
      <textarea 
        rows='6'
        cols='60'
        onChange={event => setCommentText(event.target.value)}
        value={commentText}
      />
      <div>
        <button onClick={handleAddComment} className='button'>Add Comment</button>
      </div>
      {link.comments.map((comment, index) => (
        <div key={index}>
          <p className='comment-author'>
            {comment.postedBy.name} | {distanceInWordsToNow(comment.created)}
          </p>
          <p>{comment.text}</p>
        </div>
      ))}
    </div>
  );
}

export default LinkDetail;
