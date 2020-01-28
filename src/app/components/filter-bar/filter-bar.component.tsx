import React from 'react';
import { Formik, FormikHelpers, Field, FormikProps, Form } from 'formik';
import { useQueryParam, StringParam } from 'use-query-params';

import { CategoriesContext } from '../../providers/categories/categories.provider';
import { ICategory } from '../../interfaces/link.interface';
import Tag from '../tag/tag.component';
import { SearchInput } from '../form-input/form-input.component';

import './filter-bar.styles.less';

const FilterBar: React.FC = () => {
  const { categories } = React.useContext(CategoriesContext);
  const [qsSearch, setQsSearch] = useQueryParam('q', StringParam);
  const [qsCategory, setQsCategory] = useQueryParam('category', StringParam);

  return (
    <div className="filter-bar">
      <h4>Filter by search :</h4>
      <Formik
        initialValues={{ search: '' }}
        onSubmit={async (values: any, { setSubmitting }: FormikHelpers<any>) => {
          setQsSearch(values.search);
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
      <Tag isButton text="all" color={qsCategory ? 'black' : 'green'} onClick={() => setQsCategory('')} />
      {categories.map((category: ICategory) => (
        <Tag
          isButton
          key={category.id}
          text={category.name}
          color={qsCategory === category.name ? 'green' : 'black'}
          onClick={() => setQsCategory(category.name)}
        />
      ))}
    </div>
  );
};

export default FilterBar;
