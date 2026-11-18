export type UserRole = "admin";

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  is_best_seller: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface SiteSettings {
  id: string;
  store_name: string;
  tagline: string;
  whatsapp_number: string;
  instagram_handle: string;
  address: string;
  operating_hours: string;
  about_story: string;
  about_philosophy: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutFormData {
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  orderNotes: string;
}
