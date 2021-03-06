import React, { useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, FormikHelpers, Form, Field, FormikProps } from 'formik';
import { Row, Col, PageHeader, Space, Select } from 'antd';
import { useMediaQuery } from 'beautiful-react-hooks';
import { LoadingOutlined, PlusOutlined, CloseCircleFilled, CloseCircleOutlined, SmileOutlined, CloseOutlined } from '@ant-design/icons';

// Components
import { FormInput } from '../../components/form-input/form-input.component';
import CustomButton from '../../components/custom-button/custom-button.component';
import Tag from '../../components/tag/tag.component';

// Others
import { useCurrentUser } from '../../providers/current-user/current-user.provider';
import { useLinks } from '../../providers/links/links.provider';
import { useCategories } from '../../providers/categories/categories.provider';
import { firestore } from '../../firebase/firebase.service';
import { ICreateLinkInitialState } from '../../interfaces/initial-states.type';
import { linkSchema } from '../../schemas/link.schema';
import { isError, isValid as isValidCategory } from '../../utils/form.util';
import Category from '../../models/category.model';
import { useNotification } from '../../contexts/notif/notif.context';
import { formatError } from '../../utils/format-string.util';
import { IS_MOBILE } from '../../utils/constants.util';

import './add-link.styles.less';

const INITIAL_STATE: ICreateLinkInitialState = {
  description: '',
  url: '',
  categories: []
};

const AddLinkPage: React.FC = () => {
  const { currentUser } = useCurrentUser();
  const { categories } = useCategories();
  const { addLink } = useLinks();
  const { openNotification } = useNotification();
  const history = useHistory();
  const { Option } = Select;
  const isMobile = useMediaQuery(IS_MOBILE);

  const [categoryToAdd, setCategoryToAdd] = useState<string>('');
  const [addCategoryLoading, setAddCategoryLoading] = React.useState<boolean>(false);

  const isCategorieExist = (value: string) => {
    return !!categories.find(categorie => categorie.name.toUpperCase() === value.trim().toUpperCase());
  };

  const handleRemoveCategory = async ({ id, name }: Category, event: React.MouseEvent<HTMLSpanElement, MouseEvent>): Promise<void> => {
    event.stopPropagation();
    try {
      if (!currentUser) {
        history.push('/signin');
      } else {
        await firestore
          .collection('categories')
          .doc(id)
          .delete();
      }
    } catch (err) {
      openNotification(`Cannot remove ${name} category`, formatError(err), 'error');
      console.error(err);
    }
  };

  return (
    <div className="add-link-page">
      <PageHeader onBack={history.goBack} title={<h2>Create a new link</h2>} />
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
        {({
          isSubmitting,
          isValid,
          errors,
          touched,
          values,
          setFieldValue,
          resetForm,
          setFieldTouched
        }: FormikProps<ICreateLinkInitialState>) => {
          const handleAddCategory = async (categoryToAdd: string): Promise<void> => {
            try {
              if (!currentUser) {
                history.push('/signin');
              } else {
                const newCategory: Category = { name: categoryToAdd, count: 0 };
                setAddCategoryLoading(true);
                await firestore.collection('categories').add(newCategory);
                setAddCategoryLoading(false);
                setCategoryToAdd('');
                setFieldValue('categories', [...values.categories, categoryToAdd]);
              }
            } catch (err) {
              openNotification(`Cannot add ${categoryToAdd} category`, formatError(err), 'error');
              setAddCategoryLoading(false);
              setCategoryToAdd('');
              console.error(err);
            }
          };

          return (
            <Form className="add-link-form">
              <Row gutter={[16, 16]} justify="end">
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
                <Col span={isMobile ? 24 : 12}>
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
                <Col span={isMobile ? 24 : 12}>
                  <div className="custom-select">
                    <label htmlFor="categories">Categories</label>
                    <div className="custom-select-container">
                      <Select
                        className={`${
                          isError(errors, touched, 'categories') && categoryToAdd.length === 0 ? 'custom-select-input-error' : ''
                        } custom-select-input`}
                        mode="multiple"
                        tagRender={({ value, onClose }) => {
                          return <Tag onClose={onClose} closable text={value as string} color="green" />;
                        }}
                        placeholder="Categories for the link"
                        onChange={(selectedCategories: string[]) => {
                          setCategoryToAdd('');
                          setFieldValue('categories', selectedCategories);
                        }}
                        value={values.categories}
                        onSearch={(category: string) => {
                          setCategoryToAdd(category);
                        }}
                        onDropdownVisibleChange={(open: boolean) => {
                          if (!open) {
                            setCategoryToAdd('');
                            setFieldTouched('categories', true);
                          }
                        }}
                        dropdownRender={menu => {
                          return (
                            <>
                              {categoryToAdd.length > 0 && !isCategorieExist(categoryToAdd) && (
                                <div className="add-category-button" onClick={() => handleAddCategory(categoryToAdd)}>
                                  Add <span>{categoryToAdd}</span> to categories{' '}
                                  {addCategoryLoading ? <LoadingOutlined /> : <PlusOutlined />}
                                </div>
                              )}
                              {menu}
                            </>
                          );
                        }}
                      >
                        {categories.length > 0 &&
                          categories.map((category: Category) => (
                            <Option key={category.id} value={category.name}>
                              {category.name}
                              {currentUser && currentUser.isAdmin && category.count === 0 && (
                                <span className="remove-category">
                                  ({category.count})
                                  <CloseOutlined
                                    onClick={(event: React.MouseEvent<HTMLSpanElement, MouseEvent>) =>
                                      handleRemoveCategory(category, event)
                                    }
                                  />
                                </span>
                              )}
                            </Option>
                          ))}
                      </Select>
                      {categoryToAdd.length > 0 && (
                        <CloseCircleFilled
                          className="custom-select-icon custom-select-icon-gray pointer"
                          onClick={() => {
                            setCategoryToAdd('');
                          }}
                        />
                      )}
                      {isValidCategory(errors, touched, 'categories') && categoryToAdd.length === 0 && (
                        <SmileOutlined className="custom-select-icon custom-select-icon-green" />
                      )}
                    </div>
                    {isError(errors, touched, 'categories') && categoryToAdd.length === 0 && (
                      <span className="custom-select-error-text">{errors['categories']}</span>
                    )}
                  </div>
                </Col>
              </Row>
              <div className="add-link-buttons">
                <Space size="middle" direction={isMobile ? 'vertical' : 'horizontal'} align="end">
                  <CustomButton
                    type="button"
                    text="Reset"
                    buttonType="secondary"
                    hasIcon
                    Icon={CloseCircleOutlined}
                    onClick={() => resetForm()}
                  />
                  <CustomButton
                    text="Add new link"
                    type="submit"
                    buttonType="primary"
                    loading={isSubmitting}
                    disabled={isSubmitting || !isValid}
                  />
                </Space>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default AddLinkPage;
