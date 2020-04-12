import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Formik, FormikHelpers, Form, Field, FormikProps } from 'formik';
import { Row, Col, AutoComplete, Icon, PageHeader } from 'antd';

import { FormInput } from '../../components/form-input/form-input.component';
import CustomButton from '../../components/custom-button/custom-button.component';

import { useCurrentUser } from '../../providers/current-user/current-user.provider';
import { useLinks } from '../../providers/links/links.provider';
import { useCategories } from '../../providers/categories/categories.provider';
import { firestore } from '../../firebase/firebase.service';
import { ICreateLinkInitialState } from '../../interfaces/initial-states.type';
import { linkSchema } from '../../schemas/link.schema';
import { isError, isValid as isValidCategory } from '../../utils';
import Category from '../../models/category.model';

import './add-link.styles.less';

const INITIAL_STATE: ICreateLinkInitialState = {
  description: '',
  url: '',
  category: ''
};

const AddLinkPage: React.FC<RouteComponentProps<{}>> = ({ history }) => {
  const { currentUser } = useCurrentUser();
  const { categories } = useCategories();
  const { addLink } = useLinks();

  const [addCatLoading, setAddCatLoading] = React.useState<boolean>(false);

  const isCategorieExist = (value: any) => {
    return !!categories.find(categorie => categorie.name === value);
  };

  const handleAddCategory = async (category: string): Promise<void> => {
    if (!currentUser) {
      history.push('/signin');
    } else {
      const newCategory: Category = { name: category, count: 0 };
      setAddCatLoading(true);
      await firestore.collection('categories').add(newCategory);
      setAddCatLoading(false);
    }
  };

  return (
    <div className="add-link-page">
      <PageHeader onBack={history.goBack} title={<h1 className="H2">Create a new link</h1>} />
      <Formik
        enableReinitialize
        initialValues={INITIAL_STATE}
        validationSchema={linkSchema}
        onSubmit={async (values: ICreateLinkInitialState, { setSubmitting }: FormikHelpers<ICreateLinkInitialState>) => {
          if (!currentUser) {
            history.push('/signin');
          } else {
            await addLink(values, categories, currentUser);
            setSubmitting(false);
            history.push('/');
          }
        }}
      >
        {({ isSubmitting, isValid, errors, touched, values, setFieldValue, setFieldTouched }: FormikProps<ICreateLinkInitialState>) => {
          const { Option } = AutoComplete;
          const autoCompleteChildren = categories
            .map((category: Category) => (
              <Option key={category.id} value={category.name}>
                {category.name}
              </Option>
            ))
            .concat(
              !isCategorieExist(values.category) && values.category.length !== 0
                ? [
                    <Option value="" key="add" disabled className="add-category">
                      <div onClick={() => handleAddCategory(values.category)}>
                        Add <span>{values.category}</span> to categories <Icon type={addCatLoading ? 'loading' : 'plus'} />
                      </div>
                    </Option>
                  ]
                : []
            );

          return (
            <Form className="add-link-form">
              <Row type="flex" gutter={[16, 16]} justify="end">
                <Col span={24}>
                  <Field
                    autoComplete="off"
                    name="description"
                    placeholder="A description for your link"
                    type="text"
                    hasLabel
                    label="Description"
                    component={FormInput}
                  />
                </Col>
                <Col span={12}>
                  <Field
                    autoComplete="off"
                    name="url"
                    placeholder="The URL of the link"
                    type="text"
                    hasLabel
                    label="URL"
                    component={FormInput}
                  />
                </Col>
                <Col span={12}>
                  <div
                    className={`${
                      isError(errors, touched, 'category') || (!isCategorieExist(values.category) && values.category.length !== 0)
                        ? 'custom-autocomplete-error'
                        : ''
                    } custom-autocomplete`}
                  >
                    <label htmlFor="category">Category</label>
                    <div className="custom-autocomplete-container">
                      <AutoComplete
                        placeholder="A category for yout link"
                        onChange={(value: any) => {
                          setFieldValue('category', value);
                        }}
                        filterOption={(inputValue: any, option: any) =>
                          option.props.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1 || option.props.value.length === 0
                        }
                        onBlur={() => setFieldTouched('category', true)}
                        value={values.category}
                      >
                        {autoCompleteChildren.reverse()}
                      </AutoComplete>
                      {(isError(errors, touched, 'category') || !isCategorieExist(values.category)) && values.category.length !== 0 && (
                        <Icon
                          type="close-circle"
                          theme="filled"
                          className="custom-autocomplete-icon custom-autocomplete-icon-gray pointer"
                          onClick={() => setFieldValue('category', '', true)}
                        />
                      )}
                      {isValidCategory(errors, touched, 'category') && isCategorieExist(values.category) && (
                        <Icon type="smile" className="custom-autocomplete-icon custom-autocomplete-icon-green" />
                      )}
                    </div>
                    {isError(errors, touched, 'category') && <span className="custom-autocomplete-error-text">{errors['category']}</span>}
                    {!isCategorieExist(values.category) && values.category.length !== 0 && (
                      <span className="custom-autocomplete-error-text">You should add this category</span>
                    )}
                  </div>
                </Col>
              </Row>
              <div className="add-link-buttons">
                <CustomButton
                  text="Add new link"
                  type="submit"
                  buttonType="primary"
                  loading={isSubmitting}
                  disabled={isSubmitting || !isValid}
                />
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default withRouter(AddLinkPage);
