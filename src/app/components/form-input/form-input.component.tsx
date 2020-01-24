import React from 'react';
import { FieldInputProps, FormikProps } from 'formik';
import { Icon } from 'antd';

import './form-input.styles.less';

interface IProps {
  name: string;
  placeholder: string;
  type: string;
  autoComplete?: string;
  hasLabel?: boolean;
  label?: string;
  field?: FieldInputProps<any>;
  form?: FormikProps<any>;
}

const FormInput: React.FC<IProps> = ({ field, form: { errors, touched, setFieldValue }, hasLabel, label, ...props }) => {
  const isError = (): boolean => {
    return !!(errors[field.name] && touched[field.name]);
  };

  const isValid = (): boolean => {
    return !!(!errors[field.name] && touched[field.name]);
  };

  return (
    <div className="form-input">
      {hasLabel && <label htmlFor={field.name}>{label}</label>}
      <div className="form-input-container">
        <input {...field} {...props} id={field.name} className={`${isError() ? 'form-input-error' : ''} form-input-item`} />
        {isError() && field.value.length !== 0 && (
          <Icon
            type="close-circle"
            theme="filled"
            className="form-input-icon form-input-icon-gray pointer"
            onClick={() => setFieldValue(field.name, '', true)}
          />
        )}
        {isValid() && <Icon type="smile" className="form-input-icon form-input-icon-green" />}
      </div>
      {isError() && <span className="form-input-error-text">{errors[field.name]}</span>}
    </div>
  );
};

const SearchInput: React.FC<IProps> = ({ field, form: { submitForm }, ...props }) => {
  return (
    <div className="form-input">
      <div className="form-input-container">
        <input {...field} {...props} id={field.name} className="form-input-item search" />
        <Icon type="search" theme="outlined" className="form-input-icon form-input-icon-green pointer" onClick={submitForm} />
      </div>
    </div>
  );
};

export { FormInput, SearchInput };
