import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import FirebaseContext from '../../firebase/context';
import { ILink } from '../../interfaces/link';
import { ICreateLinkInitialState } from '../../interfaces/initialState';
import { Formik, FormikActions, Form, Field, ErrorMessage } from 'formik';
import { linkSchema } from '../../validationSchema/linkSchema';

const INITIAL_STATE: ICreateLinkInitialState = {
  description: '',
  url: ''
};

const CreateLink: React.FC<RouteComponentProps> = ({ history }) => {
  const handleCreateLink = async (
    values: ICreateLinkInitialState
  ): Promise<void> => {
    if (!user) {
      history.push('/login');
    } else {
      const { url, description }: ICreateLinkInitialState = values;
      const newLink: ILink = {
        url,
        description,
        postedBy: {
          id: user.id,
          name: user.name
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

  return (
    <Formik
      initialValues={INITIAL_STATE}
      validationSchema={linkSchema}
      onSubmit={async (
        values: ICreateLinkInitialState,
        { setSubmitting }: FormikActions<ICreateLinkInitialState>
      ) => {
        await handleCreateLink(values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, isValid, errors, touched }: any) => (
        <Form className="flex flex-column">
          <Field
            name="description"
            placeholder="A description for your link"
            autoComplete="off"
            className={
              errors.description && touched.description && 'error-input'
            }
          />
          <ErrorMessage
            component="span"
            name="description"
            className="error-text"
          />

          <Field
            name="url"
            className={errors.url && touched.url && 'error-input'}
            placeholder="The URL of the link"
          />
          <ErrorMessage component="span" name="url" className="error-text" />
          <button
            type="submit"
            className="button pointer mr2"
            disabled={isSubmitting || !isValid}
            style={{
              backgroundColor: isSubmitting || !isValid ? 'grey' : 'orange'
            }}
          >
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default CreateLink;
