export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  category?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
}