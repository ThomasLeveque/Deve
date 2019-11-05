import * as yup from 'yup';

export const linkSchema = yup.object().shape({
  description: yup
    .string()
    .min(10, 'Description must be at least 10 characters')
    .required('Description required'),
  url: yup
    .string()
    .max(255)
    .matches(/^(ftp|http|https):\/\/[^ "]+$/, 'Url badly formated')
    .required('URL required'),
  category: yup
    .string()
    .required('Category required'),
});

export const categorySchema = yup.object().shape({
  name: yup
    .string()
    .required('Name required'),
})
