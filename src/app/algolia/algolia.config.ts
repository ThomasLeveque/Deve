import algoliasearch from 'algoliasearch';

export const algoliaRoutes: any = {
  localhost: 'dev_links',
  'hooks-news-9c4b2.firebaseapp.com': 'dev_links',
  'hooks-news-9c4b2.web.app': 'dev_links',
  'eve-app-dev.now.sh': 'dev_links',
  'hooks-news-ba59c.firebaseapp.com': 'prod_links',
  'hooks-news-ba59c.web.app': 'prod_links',
  'eve-app.now.sh': 'prod_links'
};

export const indexName = ((domain: string): string => algoliaRoutes[domain] || 'dev_links')(window.document.domain);

export const searchClient = algoliasearch('TTUEP8C6PR', '5c870089e63a662c62a45c974c08d990');
