import React, { memo } from 'react';
import { FieldInputProps, FormikProps } from 'formik';
import { Input } from 'antd';
import { CloseCircleFilled, SmileOutlined } from '@ant-design/icons';

import { isError, isValid } from '../../utils/form.util';

import './form-input.styles.less';

interface IProps {
  name: string;
  placeholder: string;
  type: string;
  isTextarea?: boolean;
  autoComplete?: string;
  hasLabel?: boolean;
  label?: string;
  field?: FieldInputProps<any>;
  form?: FormikProps<any>;
}

const FormInput: React.FC<IProps> = memo(
  ({ field, form: { errors, touched, setFieldValue }, isTextarea = false, hasLabel, label, ...props }) => {
    const { TextArea } = Input;
    return (
      <div className="form-input">
        {hasLabel && <label htmlFor={field.name}>{label}</label>}
        <div className="form-input-container">
          {isTextarea ? (
            <TextArea
              autoSize
              {...field}
              {...props}
              id={field.name}
              className={`${isError(errors, touched, field.name) && 'form-input-error'} form-input-item`}
            />
          ) : (
            <input
              {...field}
              {...props}
              id={field.name}
              className={`${isError(errors, touched, field.name) && 'form-input-error'} form-input-item`}
            />
          )}
          {!isTextarea && isError(errors, touched, field.name) && field.value.length !== 0 && (
            <CloseCircleFilled
              className="form-input-icon form-input-icon-gray pointer"
              onClick={() => setFieldValue(field.name, '', true)}
            />
          )}
          {!isTextarea && isValid(errors, touched, field.name) && <SmileOutlined className="form-input-icon form-input-icon-green" />}
        </div>
        {isError(errors, touched, field.name) && <span className="form-input-error-text">{errors[field.name]}</span>}
      </div>
    );
  }
);

export { FormInput };
