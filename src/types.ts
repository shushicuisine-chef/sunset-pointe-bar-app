export type Page =
  | "home"
  | "menu"
  | "cart"
  | "checkout"
  | "confirmation"
  | "status"
  | "admin-login"
  | "admin"
  | "menu-management"
  | "settings"
  | "privacy"
  | "terms";

export type MenuCategory =
  | "Breakfast"
  | "Coffee & Juice"
  | "Frozen Drinks"
  | "Beer & Wine"
  | "Sunset Cocktails"
  | "Surf & Turf Bites"
  | "Poolside Favorites";

export type PaymentMethod = "Pay at Pickup" | "Room Charge Placeholder";
export type OrderType = "Pickup" | "Room Delivery";
export type OrderStatus = "New" | "Preparing" | "Ready" | "Completed" | "Cancelled";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: MenuCategory;
  price: number;
  cost?: number;
  imageUrl?: string;
  available: boolean;
  alcohol?: boolean;
  featured?: boolean;
}

export interface CartItem {
  itemId: string;
  quantity: number;
}

export interface OrderLineItem {
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  alcohol?: boolean;
}

export interface Order {
  id: string;
  guestName: string;
  roomNumber: string;
  phone: string;
  items: OrderLineItem[];
  subtotal: number;
  tax: number;
  deliveryFee?: number;
  total: number;
  paymentMethod: PaymentMethod;
  orderType: OrderType;
  pickupTime: string;
  status: OrderStatus;
  timestamp: string;
  ageConfirmed: boolean;
}

export interface BarSettings {
  orderingPaused: boolean;
  openingTime: string;
  closingTime: string;
  roomServiceEnabled: boolean;
  roomServiceStartDay: number;
  roomServiceMinimum: number;
  deliveryFee: number;
  roomServiceHoursEnabled: boolean;
}

export interface CheckoutForm {
  guestName: string;
  roomNumber: string;
  phone: string;
  pickupTime: string;
  paymentMethod: PaymentMethod;
  orderType: OrderType;
  ageConfirmed: boolean;
}
