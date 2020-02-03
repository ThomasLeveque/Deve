import qs from 'qs';
import algoliasearch from 'algoliasearch';

export const searchClient = algoliasearch('TTUEP8C6PR', '5c870089e63a662c62a45c974c08d990');
export const indexName = 'dev_links';

export const createURL = (state: any) => {
  const isDefaultRoute =
    !state.query && !state.sortBy && state.page === 1 && state.refinementList && state.refinementList.category.length === 0;

  if (isDefaultRoute) {
    return '';
  }

  const queryParameters: any = {};

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

export const searchStateToUrl = (searchState: any) => (searchState ? createURL(searchState) : '');

export const urlToSearchState = (location: any) => {
  const { query = '', sortBy = indexName, page = 1, category = [] } = qs.parse(location.search.slice(1));
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
