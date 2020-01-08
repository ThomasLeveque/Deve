import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Formik, FormikHelpers, Form, Field, ErrorMessage } from 'formik';

import { CurrentUserContext } from '../../providers/current-user/current-user.provider';
import { CategoriesContext } from '../../providers/categories/categories.provider';
import { firestore } from '../../firebase/firebase.service';

import { ILink, ICategory } from '../../interfaces/link.interface';
import { ICreateLinkInitialState } from '../../interfaces/initial-states.type';
import { linkSchema, categorySchema } from '../../schemas/link.schema';

const INITIAL_STATE: ICreateLinkInitialState = {
  description: '',
  url: '',
  category: ''
};

const AddLinkPage: React.FC<RouteComponentProps<{}>> = ({ history }) => {
  const { currentUser } = React.useContext(CurrentUserContext);
  const { categories } = React.useContext(CategoriesContext);

  const [isAddCategory, setIsAddCategory] = React.useState<boolean>(false);
  const [addCatLoading, setAddCatLoading] = React.useState<boolean>(false);
  const [createLinkLoading, setCreateLinkLoading] = React.useState<boolean>(false);

  const handleAddCategory = async (values: ICategory): Promise<void> => {
    if (!currentUser) {
      history.push('/signin');
    } else {
      setAddCatLoading(true);
      await firestore.collection('categories').add(values);
      setAddCatLoading(false);
    }
  };

  const handleCreateLink = async ({ url, description, category }: ICreateLinkInitialState): Promise<void> => {
    if (!currentUser) {
      history.push('/signin');
    } else {
      const { id, displayName } = currentUser;
      const newLink: ILink = {
        url,
        description,
        category,
        postedBy: {
          id,
          displayName
        },
        voteCount: 0,
        votes: [],
        comments: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      setCreateLinkLoading(true);
      await firestore.collection('links').add(newLink);
      history.push('/');
    }
  };

  return (
    <div className="add-link-page">
      <Formik
        initialValues={INITIAL_STATE}
        validationSchema={linkSchema}
        onSubmit={async (values: ICreateLinkInitialState, { setSubmitting }: FormikHelpers<ICreateLinkInitialState>) => {
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
              className={errors.description && touched.description && 'error-input'}
            />
            <ErrorMessage component="span" name="description" className="error-text" />

            <Field name="url" className={errors.url && touched.url && 'error-input'} placeholder="The URL of the link" />
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
                <option key={category.id} value={category.name.toLocaleLowerCase()}>
                  {category.name}
                </option>
              ))}
            </Field>
            <ErrorMessage component="span" name="category" className="error-text" />
            <span onClick={() => setIsAddCategory((prevState: boolean) => !prevState)} className="button pointer mr2">
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
          onSubmit={async (values: ICategory, { setSubmitting }: FormikHelpers<ICategory>) => {
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
              <ErrorMessage component="span" name="name" className="error-text" />
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
    </div>
  );
};

export default withRouter(AddLinkPage);
