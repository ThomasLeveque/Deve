import React from 'react';
import { Formik, FormikHelpers, Field, FormikProps, Form } from 'formik';

import { CategoriesContext } from '../../providers/categories/categories.provider';
import { ICategory } from '../../interfaces/link.interface';
import Tag from '../tag/tag.component';

import './filter-bar.styles.less';
import { SearchInput } from '../form-input/form-input.component';

const FilterBar: React.FC = () => {
  const { categories } = React.useContext(CategoriesContext);

  return (
    <div className="filter-bar">
      <h4>Filter by search :</h4>
      <Formik
        initialValues={{ search: '' }}
        onSubmit={async (values: any, { setSubmitting }: FormikHelpers<any>) => {
          console.log(values);
          setSubmitting(false);
        }}
        enableReinitialize
      >
        {({ isSubmitting }: FormikProps<any>) => (
          <Form autoComplete="off" className="flex column align-items-center">
            <Field name="search" autoComplete="off" placeholder="Seach a link..." type="text" component={SearchInput} />
          </Form>
        )}
      </Formik>
      <h4>Filter by categories :</h4>
      {categories.map((category: ICategory) => (
        <Tag key={category.id} text={category.name} color="green" />
      ))}
    </div>
  );
};

export default FilterBar;
