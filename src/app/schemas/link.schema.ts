import * as yup from 'yup';

const descMin = 10;
const descMax = 255;
const urlMax = 255;
const categoriesMax = 4;

export const linkSchema = yup.object().shape({
  description: yup
    .string()
    .min(descMin, `Description must be at least ${descMin} characters`)
    .max(descMax, `Description must be shorter than ${descMax} characters`)
    .required('Description required'),
  url: yup
    .string()
    .max(urlMax, `Url must be shorter than ${urlMax} characters`)
    .matches(/^(ftp|http|https):\/\/[^ "]+$/, 'Url badly formated')
    .required('URL required'),
  categories: yup
    .array<string>()
    .max(categoriesMax, `A link cannot have more then ${categoriesMax} categories`)
    .required('At least one category required')
});

export const commentSchema = yup.object().shape({
  commentText: yup.string().required('Comment required')
});
