import React from 'react';
import { useField, FieldInputProps, FieldMetaProps, FormikProps, useFormikContext, FieldAttributes } from 'formik';
import { Icon } from 'antd';

import './input.style.less';

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
    <div className="input">
      {hasLabel && <label htmlFor={field.name}>{label}</label>}
      <div className="input-container">
        <input {...field} {...props} id={field.name} className={isError() ? 'input-error input-component' : 'input-component'} />
        {isError() && field.value.length !== 0 && (
          <Icon
            type="close-circle"
            theme="filled"
            className="input-icon input-icon-gray pointer"
            onClick={() => setFieldValue(field.name, '', true)}
          />
        )}
        {isValid() && <Icon type="smile" className="input-icon input-icon-green" />}
      </div>
      {isError() && <span className="input-error-text">{errors[field.name]}</span>}
    </div>
  );
};

export { FormInput };
