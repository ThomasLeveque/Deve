import Category from "../models/category.model";

export interface CategoryMapping {
  [categoryName: string]: Category
}