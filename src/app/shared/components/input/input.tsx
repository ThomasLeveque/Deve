import React from 'react';
import { FormikProps } from 'formik';
import { Icon } from 'antd';

import './input.style.less';

interface IField {
  name: string;
  value: string;
  onChange: () => void;
  onBlur: () => void;
}

interface IProps {
  field: IField;
  form: FormikProps<any>;
}

const FormInput: React.FC<IProps> = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  const isError = (): boolean => {
    return !!(errors[field.name] && touched[field.name]);
  };

  const isValid = (): boolean => {
    return !!(!errors[field.name] && touched[field.name]);
  };

  return (
    <div className="input">
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
