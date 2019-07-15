import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import FirebaseContext from '../../firebase/context';
import { ILink, ICategory } from '../../interfaces/link';
import { ICreateLinkInitialState } from '../../interfaces/initialState';
import { Formik, FormikActions, Form, Field, ErrorMessage } from 'formik';
import { linkSchema, categorySchema } from '../../validationSchema/linkSchema';
import { firebaseSnapshot } from '../../interfaces/firebase';

const INITIAL_STATE: ICreateLinkInitialState = {
  description: '',
  url: '',
  category: ''
};

const CreateLink: React.FC<RouteComponentProps> = ({ history }) => {
  const [isAddCategory, setIsAddCategory] = React.useState<boolean>(false);
  const [categories, setCategories] = React.useState<ICategory[]>([]);
  const { firebase, user } = React.useContext(FirebaseContext);

  React.useEffect(() => {
    getCategories();
  }, []);

  const getCategories = (): any => {
    return firebase.db.collection('categories').onSnapshot(handleSnapshot);
  };

  const handleSnapshot = (snapshot: firebaseSnapshot) => {
    const categories: ICategory[] = snapshot.docs.map((doc: any) => {
      return {
        id: doc.id,
        ...doc.data()
      };
    });
    setCategories(categories);
  };

  const handleAddCategory = async (values: ICategory): Promise<void> => {
    if (!user) {
      history.push('/login');
    } else {
      await firebase.db.collection('categories').add(values);
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
          console.log(values);
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
                <option key={category.id} value={category.name.toLocaleLowerCase()}>{category.name}</option>
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
              Submit
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
                Add category
              </button>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};

export default CreateLink;
