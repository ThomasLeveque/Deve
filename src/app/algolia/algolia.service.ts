import qs from 'qs';

import { IQueryParameters, IQueryState } from './algolia.interface';
import { indexName } from './algolia.config';

export const createURL = (state: IQueryParameters): string => {
  const isDefaultRoute =
    !state.query && !state.sortBy && state.page === 1 && state.refinementList && state.refinementList.category.length === 0;

  if (isDefaultRoute) {
    return '';
  }

  const queryParameters: Partial<IQueryState> = {};

  if (state.sortBy) {
    queryParameters.sortBy = encodeURIComponent(state.sortBy);
  }

  if (state.query) {
    queryParameters.query = encodeURIComponent(state.query);
  }

  if (state.page !== 1) {
    queryParameters.page = state.page;
  }

  if (state.refinementList.category) {
    queryParameters.category = state.refinementList.category.map(encodeURIComponent);
  }

  const queryString = qs.stringify(queryParameters, {
    addQueryPrefix: true,
    arrayFormat: 'repeat'
  });

  return queryString;
};

export const searchStateToUrl = (searchState: IQueryParameters): string => (searchState ? createURL(searchState) : '');

export const urlToSearchState = (location: any): IQueryParameters => {
  const { query = '', sortBy = indexName, page = 1, category = [] }: IQueryState = qs.parse(location.search.slice(1));
  // `qs` does not return an array when there's a single value.
  const allCategories = Array.isArray(category) ? category : [category].filter(Boolean);

  return {
    query: decodeURIComponent(query),
    sortBy: decodeURIComponent(sortBy),
    page,
    refinementList: {
      category: allCategories.map(decodeURIComponent)
    }
  };
};
