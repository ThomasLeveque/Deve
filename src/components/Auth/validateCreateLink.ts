import { ICreateLinkErrors } from '../../interfaces/errors';

export default function validateCreateLink(values: any) {
  let errors: ICreateLinkErrors = {
    description: '',
    url: ''
  };

  // Description Erros
  if (!values.description) {
    errors.description = 'Description required';
  } else if (values.description.length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }

  // Url Erros
  if (!values.url) {
    errors.url = 'Url required';
  } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(values.url)) {
    errors.url = 'Url must be valid';
  }

  return errors;
}
