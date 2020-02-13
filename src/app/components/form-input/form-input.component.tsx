import React from 'react';
import { FieldInputProps, FormikProps } from 'formik';
import { Icon } from 'antd';

import './form-input.styles.less';
import { isError, isValid } from '../../utils';

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
  return (
    <div className="form-input">
      {hasLabel && <label htmlFor={field.name}>{label}</label>}
      <div className="form-input-container">
        <input
          {...field}
          {...props}
          id={field.name}
          className={`${isError(errors, touched, field.name) ? 'form-input-error' : ''} form-input-item`}
        />
        {isError(errors, touched, field.name) && field.value.length !== 0 && (
          <Icon
            type="close-circle"
            theme="filled"
            className="form-input-icon form-input-icon-gray pointer"
            onClick={() => setFieldValue(field.name, '', true)}
          />
        )}
        {isValid(errors, touched, field.name) && <Icon type="smile" className="form-input-icon form-input-icon-green" />}
      </div>
      {isError(errors, touched, field.name) && <span className="form-input-error-text">{errors[field.name]}</span>}
    </div>
  );
};

export { FormInput };
