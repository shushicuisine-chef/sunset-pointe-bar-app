export type Page =
  | "home"
  | "menu"
  | "cart"
  | "checkout"
  | "confirmation"
  | "status"
  | "reservations"
  | "admin-login"
  | "admin"
  | "menu-management"
  | "settings"
  | "privacy"
  | "terms";

export type MenuCategory =
  | "Breakfast"
  | "Coffee & Juice"
  | "Slushies"
  | "Beer & Wine"
  | "Sunset Refreshers"
  | "Surf & Turf Bites"
  | "Smoked Meats"
  | "Poolside Favorites";

export type PaymentMethod = "Pay at Pickup" | "Room Charge Placeholder";
export type OrderType = "Pickup" | "Room Delivery";
export type OrderStatus = "New" | "Preparing" | "Ready" | "Completed" | "Cancelled";
export type ReservationStatus = "New" | "Contacted" | "Confirmed" | "Declined" | "Completed";
export type FulfillmentType =
  | "marketplace-pickup"
  | "pool-pickup"
  | "chair-delivery"
  | "sunset-pointe-pickup"
  | "dine-in"
  | "reservation-only"
  | "room-delivery";

export interface Property {
  id: string;
  name: string;
  shortName: string;
  domain: string;
  roomCount?: number;
  brandName: string;
  operatorName: string;
  description: string;
}

export interface Venue {
  id: string;
  propertyId: string;
  name: string;
  description: string;
  imageUrl?: string;
}

export interface RevenueCenter {
  id: string;
  propertyId: string;
  venueId?: string;
  name: string;
  description: string;
}

export interface OperatingWindow {
  id: string;
  propertyId: string;
  venueId?: string;
  experienceId?: string;
  label: string;
  startTime: string;
  endTime: string;
}

export interface Experience {
  id: string;
  propertyId: string;
  venueId?: string;
  revenueCenterId?: string;
  name: string;
  description: string;
  imageUrl?: string;
  operatingWindowId?: string;
  reservationEnabled?: boolean;
  orderEnabled?: boolean;
  capacity?: number;
}

export interface FulfillmentMethod {
  id: string;
  propertyId: string;
  venueId?: string;
  name: string;
  type: FulfillmentType;
  fee: number;
  enabled: boolean;
  estimatedMinutes: number;
}

export interface EventAnnouncement {
  id: string;
  propertyId: string;
  venueId?: string;
  revenueCenterId?: string;
  title: string;
  body: string;
  startsAt?: string;
  endsAt?: string;
  featured?: boolean;
}

export interface InventoryItem {
  id: string;
  propertyId: string;
  venueId?: string;
  revenueCenterId?: string;
  name: string;
  description: string;
  unit: "each" | "cup" | "half-pound" | "pound" | "bottle" | "market-price" | "variable-weight";
  price?: number;
  quantityAvailable?: number;
  soldOut?: boolean;
  imageUrl?: string;
}

export interface ReservationExperience {
  id: string;
  propertyId: string;
  venueId: string;
  revenueCenterId: string;
  name: string;
  description: string;
  capacity: number;
  reservationOnly: boolean;
  imageUrl?: string;
}

export interface MenuItem {
  id: string;
  propertyId?: string;
  venueId?: string;
  experienceId?: string;
  revenueCenterId?: string;
  fulfillmentMethodIds?: string[];
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
  propertyId?: string;
  venueId?: string;
  revenueCenterId?: string;
  fulfillmentMethodId?: string;
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

export interface ReservationForm {
  guestName: string;
  roomNumber: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  partySize: number;
  notes: string;
}

export interface ReservationRequest extends ReservationForm {
  id: string;
  propertyId: string;
  venueId: string;
  experienceId: string;
  revenueCenterId: string;
  status: ReservationStatus;
  timestamp: string;
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
