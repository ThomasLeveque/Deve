import React from 'react';

const useFormValidation = (initialState: any, validate: any, authenticate: any) => {
  const [values, setValues] = React.useState<any>(initialState);
  const [errors, setErrors] = React.useState<any>({});
  const [isSubmitting, setSubmitting] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (isSubmitting) {
      const noErrors = Object.keys(errors).length === 0;
      if (noErrors) {
        authenticate();
        setSubmitting(false);
      } else {
        setSubmitting(false);
      }
    }
  }, [errors]);

  const handleChange = (event: any): void => {
    event.persist();
    setValues((previousValues: any) => ({
      ...previousValues,
      [event.target.name]: event.target.value
    }));
  };

  const handleBlur = (): void => {
    const validationErrors = validate(values);
    setErrors(validationErrors);
  };

  const handleSubmit = (event: any): void => {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setSubmitting(true);
  };

  return {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    isSubmitting
  };
};

export default useFormValidation;
