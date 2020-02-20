export interface IQuery {
  query: string;
  sortBy: string;
  page: number;
}

export interface IQueryState extends IQuery {
  category: string[];
}

export interface IQueryParameters extends IQuery {
  refinementList: {
    category: string[];
  };
}
