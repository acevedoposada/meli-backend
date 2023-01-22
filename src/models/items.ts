export interface Product {
  id: string;
  title: string;
  price: Currency;
  picture: string;
  condition: string;
  free_shipping: boolean;
  description?: string;
  sold_quantity?: number;
}

export interface Currency {
  id: string;
  currency: string;
  amount: number;
  decimals: number;
}

export interface Author {
  name: string;
  lastname: string;
}

export interface PathFromRootElement {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  path_from_root: PathFromRootElement[];
}

export interface Filter {
  id: string;
  name: string;
  type: string;
  values: Category[];
}

export interface Pagination {
  total: number;
  offset: number;
  limit: number;
}

export interface ItemModel {
  author: Author;
  item: Product;
}

export interface ItemsModel {
  author: Author;
  categories: Category[];
  items: ItemModel[];
  pagination: Pagination;
}
