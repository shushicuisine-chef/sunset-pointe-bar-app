import type { Order } from "../types";

export type PaymentProvider = "stripe" | "square";

export const paymentProviderOptions: { id: PaymentProvider; label: string }[] = [
  { id: "stripe", label: "Stripe" },
  { id: "square", label: "Square" },
];

export interface PaymentIntentDraft {
  provider: PaymentProvider;
  amount: number;
  orderId: string;
  metadata: {
    roomNumber: string;
    orderType: string;
  };
}

export const buildPaymentIntentDraft = (order: Order, provider: PaymentProvider = "stripe"): PaymentIntentDraft => ({
  provider,
  amount: Math.round(order.total * 100),
  orderId: order.id,
  metadata: {
    roomNumber: order.roomNumber,
    orderType: order.orderType,
  },
});
