export type SortByType = 'recent' | 'liked' | 'oldest';

export interface IQueryString {
  sortby: SortByType;
  search: string;
  category: string;
}
