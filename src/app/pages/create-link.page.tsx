import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import FirebaseContext from '../firebase/firebase.context';
import { ILink, ICategory } from '../interfaces/link.interface';
import { ICreateLinkInitialState } from '../interfaces/initial-states.type';
import { Formik, FormikActions, Form, Field, ErrorMessage } from 'formik';
import { linkSchema, categorySchema } from '../schemas/link.schema';

const INITIAL_STATE: ICreateLinkInitialState = {
  description: '',
  url: '',
  category: ''
};

const CreateLinkPage: React.FC<RouteComponentProps> = ({ history }) => {
  const [isAddCategory, setIsAddCategory] = React.useState<boolean>(false);

  const [addCatLoading, setAddCatLoading] = React.useState<boolean>(false);
  const [createLinkLoading, setCreateLinkLoading] = React.useState<boolean>(
    false
  );

  const { firebase, user, categories, _window } = React.useContext(FirebaseContext);

  const handleAddCategory = async (values: ICategory): Promise<void> => {
    if (!user) {
      history.push('/login');
    } else {
      setAddCatLoading(true);
      await firebase.db.collection('categories').add(values);
      setAddCatLoading(false);
    }
  };

  const handleCreateLink = async ({
    url,
    description,
    category
  }: ICreateLinkInitialState): Promise<void> => {
    if (!user) {
      history.push('/login');
    } else {
      const newLink: ILink = {
        url,
        description,
        category,
        postedBy: {
          id: user.id,
          name: user.name
        },
        voteCount: 0,
        votes: [],
        comments: [],
        created: Date.now()
      };
      setCreateLinkLoading(true);
      await firebase.db.collection('links').add(newLink);
      history.push('/');
    }
  };

  return (
    <>
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
            <Field
              component="select"
              name="category"
              placeholder="Choose a category"
              className={errors.category && touched.category && 'error-input'}
            >
              <option value="" disabled hidden>
                Choose a category
              </option>
              {categories.map((category: ICategory) => (
                <option
                  key={category.id}
                  value={category.name.toLocaleLowerCase()}
                >
                  {category.name}
                </option>
              ))}
            </Field>
            <ErrorMessage
              component="span"
              name="category"
              className="error-text"
            />
            <span
              onClick={() =>
                setIsAddCategory((prevState: boolean) => !prevState)
              }
              className="button pointer mr2"
            >
              {isAddCategory ? 'Cancel -' : 'Add +'}
            </span>
            <button
              type="submit"
              className="button pointer mr2"
              disabled={isSubmitting || !isValid}
              style={{
                backgroundColor: isSubmitting || !isValid ? 'grey' : 'orange'
              }}
            >
              {createLinkLoading ? 'Loading...' : 'Submit'}
            </button>
          </Form>
        )}
      </Formik>
      {isAddCategory && (
        <Formik
          initialValues={{ name: '' }}
          validationSchema={categorySchema}
          onSubmit={async (
            values: ICategory,
            { setSubmitting }: FormikActions<ICategory>
          ) => {
            await handleAddCategory(values);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, isValid, errors, touched }: any) => (
            <Form className="flex flex-column">
              <Field
                name="name"
                placeholder="A name for your category"
                autoComplete="off"
                className={errors.name && touched.name && 'error-input'}
              />
              <ErrorMessage
                component="span"
                name="name"
                className="error-text"
              />
              <button
                type="submit"
                className="button pointer mr2"
                disabled={isSubmitting || !isValid}
                style={{
                  backgroundColor: isSubmitting || !isValid ? 'grey' : 'orange'
                }}
              >
                {addCatLoading ? 'Loading...' : 'Add category'}
              </button>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};

export default CreateLinkPage;
