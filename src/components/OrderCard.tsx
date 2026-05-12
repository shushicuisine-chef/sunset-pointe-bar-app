import { Clock, Phone, UserRound } from "lucide-react";
import { formatDateTime, formatMoney, formatTime } from "../lib/format";
import type { Order, OrderStatus } from "../types";

const statuses: OrderStatus[] = ["New", "Preparing", "Ready", "Completed", "Cancelled"];

interface OrderCardProps {
  order: Order;
  onStatusChange?: (status: OrderStatus) => void;
}

export function OrderCard({ order, onStatusChange }: OrderCardProps) {
  return (
    <article className="rounded-lg border border-navy-950/10 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-sunset-500">{order.id}</p>
          <h3 className="mt-1 text-lg font-semibold">{order.guestName}</h3>
          <div className="mt-2 grid gap-1 text-sm text-navy-900/70">
            <span className="inline-flex items-center gap-2">
              <UserRound size={15} />
              Room {order.roomNumber}
            </span>
            <span className="inline-flex items-center gap-2">
              <Phone size={15} />
              {order.phone}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock size={15} />
              {order.orderType} at {formatTime(order.pickupTime)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="rounded-full bg-navy-950 px-3 py-1 text-xs font-bold text-white">{order.status}</span>
          <p className="mt-2 text-sm text-navy-900/60">{formatDateTime(order.timestamp)}</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-foam p-3">
        {order.items.map((item) => (
          <div className="flex justify-between gap-3 py-1 text-sm" key={`${order.id}-${item.itemId}`}>
            <span>
              {item.quantity} x {item.name}
              {item.alcohol ? <span className="ml-2 font-semibold text-coral-500">21+</span> : null}
            </span>
            <span className="font-semibold">{formatMoney(item.unitPrice * item.quantity)}</span>
          </div>
        ))}
        <div className="mt-2 border-t border-navy-950/10 pt-2 text-sm">
          <div className="flex justify-between">
            <span>Payment</span>
            <span>{order.paymentMethod}</span>
          </div>
          <div className="mt-1 flex justify-between font-bold">
            <span>Total</span>
            <span>{formatMoney(order.total)}</span>
          </div>
          {order.deliveryFee ? (
            <div className="mt-1 flex justify-between text-xs text-navy-900/60">
              <span>Includes delivery fee</span>
              <span>{formatMoney(order.deliveryFee)}</span>
            </div>
          ) : null}
        </div>
      </div>

      {onStatusChange ? (
        <label className="mt-4 block text-sm font-semibold">
          Status
          <select
            className="mt-2 h-12 w-full rounded-lg border border-navy-950/10 bg-white px-3 text-sm"
            value={order.status}
            onChange={(event) => onStatusChange(event.target.value as OrderStatus)}
          >
            {statuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
      ) : null}
    </article>
  );
}
