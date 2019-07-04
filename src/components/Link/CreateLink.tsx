import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import useFormValidation from '../Auth/useFormValidation';
import validateCreateLink from '../Auth/validateCreateLink';
import FirebaseContext from '../../firebase/context';
import { ILink } from '../../interfaces/link';
import { ICreateLinkInitialState } from '../../interfaces/initialState';

const INITIAL_STATE: ICreateLinkInitialState = {
  description: '',
  url: ''
};

const CreateLink: React.FC<RouteComponentProps> = ({ history }) => {
  const handleCreateLink = async (): Promise<void> => {
    if (!user) {
      history.push('/login');
    } else {
      const { url, description }: ICreateLinkInitialState = values;
      const newLink: ILink = {
        url,
        description,
        postedBy: {
          id: user.uid,
          name: user.displayName
        },
        voteCount: 0,
        votes: [],
        comments: [],
        created: Date.now()
      };

      await firebase.db.collection('links').add(newLink);
      history.push('/');
    }
  };

  const { firebase, user } = React.useContext(FirebaseContext);
  const { handleSubmit, handleChange, values, errors } = useFormValidation(
    INITIAL_STATE,
    validateCreateLink,
    handleCreateLink
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-column mt3">
      <input
        onChange={handleChange}
        value={values.description}
        name="description"
        placeholder="A description for your link"
        autoComplete="off"
        type="text"
        className={errors.description && 'error-input'}
      />
      {errors.description && <p className="error-text">{errors.description}</p>}
      <input
        onChange={handleChange}
        value={values.url}
        name="url"
        placeholder="The URL of the link"
        autoComplete="off"
        type="text"
        className={errors.url && 'error-input'}
      />
      {errors.url && <p className="error-text">{errors.url}</p>}
      <button className="button" type="submit">
        Submit
      </button>
    </form>
  );
};

export default CreateLink;
