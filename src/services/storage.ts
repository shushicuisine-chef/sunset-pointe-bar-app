import { initialMenuItems, initialSettings, sampleOrders } from "../data/menu";
import type { BarSettings, CartItem, CheckoutForm, MenuItem, Order, OrderStatus } from "../types";

const TAX_RATE = 0.07;
const MENU_KEY = "sunset-pointe-menu";
const ORDERS_KEY = "sunset-pointe-orders";
const SETTINGS_KEY = "sunset-pointe-settings";

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = <T,>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const roundMoney = (value: number) => Math.round(value * 100) / 100;

const mergeMenuDefaults = (items: MenuItem[]) => {
  const defaults = new Map(initialMenuItems.map((item) => [item.id, item]));
  return items.map((item) => {
    const defaultItem = defaults.get(item.id);
    const shouldRefreshStockImage =
      Boolean(defaultItem?.imageUrl) &&
      (!item.imageUrl || item.imageUrl.includes("source.unsplash.com"));

    return {
      ...defaultItem,
      ...item,
      cost: item.cost ?? defaultItem?.cost,
      imageUrl: shouldRefreshStockImage ? defaultItem?.imageUrl : item.imageUrl,
    };
  });
};

export const getMenuItems = () => mergeMenuDefaults(read<MenuItem[]>(MENU_KEY, initialMenuItems));

export const saveMenuItems = (items: MenuItem[]) => write(MENU_KEY, items);

export const getOrders = () => read<Order[]>(ORDERS_KEY, sampleOrders);

export const saveOrders = (orders: Order[]) => write(ORDERS_KEY, orders);

export const getSettings = () => read<BarSettings>(SETTINGS_KEY, initialSettings);

export const saveSettings = (settings: BarSettings) => write(SETTINGS_KEY, settings);

export const calculateCart = (cart: CartItem[], menuItems: MenuItem[]) => {
  const lines = cart
    .map((cartItem) => {
      const item = menuItems.find((menuItem) => menuItem.id === cartItem.itemId);
      if (!item) return null;
      return {
        itemId: item.id,
        name: item.name,
        quantity: cartItem.quantity,
        unitPrice: item.price,
        alcohol: item.alcohol,
      };
    })
    .filter(Boolean) as Order["items"];

  const subtotal = roundMoney(lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0));
  const tax = roundMoney(subtotal * TAX_RATE);

  return {
    lines,
    subtotal,
    tax,
    total: roundMoney(subtotal + tax),
    hasAlcohol: lines.some((line) => line.alcohol),
  };
};

export const createOrder = (cart: CartItem[], menuItems: MenuItem[], form: CheckoutForm, settings: BarSettings) => {
  const summary = calculateCart(cart, menuItems);
  const deliveryFee =
    form.orderType === "Room Delivery" && settings.roomServiceEnabled ? roundMoney(settings.deliveryFee) : 0;
  const orders = getOrders();
  const nextNumber =
    Math.max(
      1043,
      ...orders.map((order) => {
        const numeric = Number(order.id.replace("SPB-", ""));
        return Number.isFinite(numeric) ? numeric : 1043;
      }),
    ) + 1;

  const order: Order = {
    id: `SPB-${nextNumber}`,
    guestName: form.guestName.trim(),
    roomNumber: form.roomNumber.trim(),
    phone: form.phone.trim(),
    items: summary.lines,
    subtotal: summary.subtotal,
    tax: summary.tax,
    deliveryFee,
    total: roundMoney(summary.total + deliveryFee),
    paymentMethod: form.paymentMethod,
    orderType: form.orderType,
    pickupTime: form.pickupTime,
    status: "New",
    timestamp: new Date().toISOString(),
    ageConfirmed: form.ageConfirmed,
  };

  saveOrders([order, ...orders]);
  return order;
};

export const updateOrderStatus = (orderId: string, status: OrderStatus) => {
  const orders = getOrders().map((order) => (order.id === orderId ? { ...order, status } : order));
  saveOrders(orders);
  return orders;
};

export const exportOrdersCsv = (orders: Order[]) => {
  const header = [
    "Order ID",
    "Timestamp",
    "Guest",
    "Room",
    "Phone",
    "Type",
    "Pickup Time",
    "Status",
    "Payment",
    "Subtotal",
    "Tax",
    "Total",
    "Items",
  ];

  const rows = orders.map((order) => [
    order.id,
    order.timestamp,
    order.guestName,
    order.roomNumber,
    order.phone,
    order.orderType,
    order.pickupTime,
    order.status,
    order.paymentMethod,
    order.subtotal.toFixed(2),
    order.tax.toFixed(2),
    order.total.toFixed(2),
    order.items.map((item) => `${item.quantity}x ${item.name}`).join("; "),
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `sunset-pointe-sales-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
