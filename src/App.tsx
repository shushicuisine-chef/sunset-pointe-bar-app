import {
  BadgeDollarSign,
  BellOff,
  Clock3,
  Download,
  Home,
  Image,
  LockKeyhole,
  MapPin,
  Menu as MenuIcon,
  PackageCheck,
  PanelRightOpen,
  Phone,
  ReceiptText,
  Search,
  Settings,
  ShoppingBag,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "./components/AppShell";
import { Button } from "./components/Button";
import { MenuCard } from "./components/MenuCard";
import { OrderCard } from "./components/OrderCard";
import heroImage from "./assets/sunset-pointe-hero.png";
import { initialMenuItems, initialSettings, menuCategories } from "./data/menu";
import { formatMoney, formatTime } from "./lib/format";
import { buildPaymentIntentDraft, paymentProviderOptions } from "./services/payment";
import {
  calculateCart,
  createOrder,
  exportOrdersCsv,
  getMenuItems,
  getOrders,
  getSettings,
  saveMenuItems,
  saveSettings,
  updateOrderStatus,
} from "./services/storage";
import type { BarSettings, CartItem, CheckoutForm, MenuCategory, MenuItem, Order, OrderStatus, Page } from "./types";

const adminPassword = "sunset90";
const primaryDomain = "sunsetpointebar.com";

const emptyCheckoutForm: CheckoutForm = {
  guestName: "",
  roomNumber: "",
  phone: "",
  pickupTime: "18:00",
  paymentMethod: "Pay at Pickup",
  orderType: "Pickup",
  ageConfirmed: false,
};

export default function App() {
  const [page, setPage] = useState<Page>(() => pageFromPath(window.location.pathname));
  const [history, setHistory] = useState<Page[]>([pageFromPath(window.location.pathname)]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(getMenuItems);
  const [orders, setOrders] = useState<Order[]>(getOrders);
  const [settings, setSettings] = useState<BarSettings>(getSettings);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState(menuCategories[0]);
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>(emptyCheckoutForm);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [statusLookup, setStatusLookup] = useState("");
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminError, setAdminError] = useState("");

  const cartSummary = useMemo(() => calculateCart(cart, menuItems), [cart, menuItems]);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const onPopState = () => {
      const nextPage = pageFromPath(window.location.pathname);
      setPage(nextPage);
      setHistory([nextPage]);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (nextPage: Page, replace = false) => {
    setPage(nextPage);
    setHistory((current) => [...current, nextPage]);
    const nextPath = pathForPage(nextPage);
    if (window.location.pathname !== nextPath) {
      const action = replace ? "replaceState" : "pushState";
      window.history[action](null, "", nextPath);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setHistory((current) => {
      const nextHistory: Page[] = current.length > 1 ? current.slice(0, -1) : ["home"];
      const previousPage = nextHistory[nextHistory.length - 1] ?? "home";
      setPage(previousPage);
      window.history.pushState(null, "", pathForPage(previousPage));
      return nextHistory;
    });
  };

  const addToCart = (itemId: string) => {
    setCart((current) => {
      const existing = current.find((item) => item.itemId === itemId);
      if (existing) {
        return current.map((item) =>
          item.itemId === itemId ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...current, { itemId, quantity: 1 }];
    });
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    setCart((current) => {
      if (quantity <= 0) return current.filter((item) => item.itemId !== itemId);
      return current.map((item) => (item.itemId === itemId ? { ...item, quantity } : item));
    });
  };

  const persistMenu = (nextItems: MenuItem[]) => {
    setMenuItems(nextItems);
    saveMenuItems(nextItems);
  };

  const persistSettings = (nextSettings: BarSettings) => {
    setSettings(nextSettings);
    saveSettings(nextSettings);
  };

  const changeOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(updateOrderStatus(orderId, status));
  };

  const submitOrder = () => {
    if (!cart.length) return;
    const order = createOrder(cart, menuItems, checkoutForm, settings);
    buildPaymentIntentDraft(order);
    setOrders(getOrders());
    setLastOrder(order);
    setStatusLookup(order.id);
    setCart([]);
    setCheckoutForm(emptyCheckoutForm);
    navigate("confirmation");
  };

  const loginAdmin = () => {
    if (adminPasswordInput === adminPassword) {
      setIsAdmin(true);
      setAdminError("");
      navigate("admin", true);
      return;
    }
    setAdminError("Use the demo password sunset90.");
  };

  const statusOrder = orders.find((order) => order.id.toLowerCase() === statusLookup.trim().toLowerCase());
  const featuredItems = menuItems.filter((item) => item.featured).slice(0, 4);
  const visibleItems = menuItems.filter((item) => item.category === activeCategory);
  const openOrders = orders.filter((order) => !["Completed", "Cancelled"].includes(order.status));
  const completedSales = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce((sum, order) => sum + order.total, 0);

  const pageContent = {
    home: (
      <HomePage
        settings={settings}
        featuredItems={featuredItems}
        onNavigate={navigate}
        onAdd={addToCart}
      />
    ),
    menu: (
      <MenuPage
        activeCategory={activeCategory}
        items={visibleItems}
        settings={settings}
        onCategoryChange={setActiveCategory}
        onAdd={addToCart}
      />
    ),
    cart: (
      <CartPage
        cart={cart}
        menuItems={menuItems}
        summary={cartSummary}
        onQuantityChange={updateCartQuantity}
        onNavigate={navigate}
      />
    ),
    checkout: (
      <CheckoutPage
        form={checkoutForm}
        settings={settings}
        summary={cartSummary}
        onChange={setCheckoutForm}
        onSubmit={submitOrder}
      />
    ),
    confirmation: <ConfirmationPage order={lastOrder} onNavigate={navigate} />,
    status: (
      <StatusPage
        lookup={statusLookup}
        order={statusOrder}
        onLookupChange={setStatusLookup}
      />
    ),
    "admin-login": (
      <AdminLoginPage
        password={adminPasswordInput}
        error={adminError}
        onPasswordChange={setAdminPasswordInput}
        onSubmit={loginAdmin}
      />
    ),
    admin: isAdmin ? (
      <AdminDashboardPage
        orders={orders}
        openOrders={openOrders.length}
        completedSales={completedSales}
        settings={settings}
        onStatusChange={changeOrderStatus}
        onNavigate={navigate}
        onExport={() => exportOrdersCsv(orders)}
      />
    ) : (
      <AdminLoginPage
        password={adminPasswordInput}
        error={adminError}
        onPasswordChange={setAdminPasswordInput}
        onSubmit={loginAdmin}
      />
    ),
    "menu-management": isAdmin ? (
      <MenuManagementPage
        items={menuItems}
        onNavigate={navigate}
        onChange={persistMenu}
      />
    ) : (
      <AdminGate onNavigate={navigate} />
    ),
    settings: isAdmin ? (
      <SettingsPage
        settings={settings}
        onNavigate={navigate}
        onChange={persistSettings}
      />
    ) : (
      <AdminGate onNavigate={navigate} />
    ),
    privacy: <PrivacyPage onNavigate={navigate} />,
    terms: <TermsPage onNavigate={navigate} />,
  } satisfies Record<Page, ReactNode>;

  return (
    <AppShell page={page} cartCount={cartCount} onNavigate={navigate} onBack={goBack}>
      {pageContent[page]}
    </AppShell>
  );
}

function pageFromPath(pathname: string): Page {
  if (pathname === "/admin") return "admin";
  if (pathname === "/admin/menu") return "menu-management";
  if (pathname === "/admin/settings") return "settings";
  if (pathname === "/menu") return "menu";
  if (pathname === "/cart") return "cart";
  if (pathname === "/checkout") return "checkout";
  if (pathname === "/status") return "status";
  if (pathname === "/confirmation") return "confirmation";
  if (pathname === "/privacy") return "privacy";
  if (pathname === "/terms") return "terms";
  return "home";
}

function pathForPage(page: Page) {
  const paths: Record<Page, string> = {
    home: "/",
    menu: "/menu",
    cart: "/cart",
    checkout: "/checkout",
    confirmation: "/confirmation",
    status: "/status",
    "admin-login": "/admin",
    admin: "/admin",
    "menu-management": "/admin/menu",
    settings: "/admin/settings",
    privacy: "/privacy",
    terms: "/terms",
  };

  return paths[page];
}

function Notice({ settings }: { settings: BarSettings }) {
  return (
    <div className="rounded-lg border border-sunset-500/25 bg-sunset-100 p-4 text-sm leading-6 text-navy-900">
      <p className="font-bold">Pickup available at Sunset Pointe Bar.</p>
      <p>Room delivery coming soon.</p>
      {settings.orderingPaused ? (
        <p className="mt-2 font-semibold text-coral-500">Online ordering is paused. The menu remains available.</p>
      ) : null}
    </div>
  );
}

function HomePage({
  settings,
  featuredItems,
  onNavigate,
  onAdd,
}: {
  settings: BarSettings;
  featuredItems: MenuItem[];
  onNavigate: (page: Page) => void;
  onAdd: (id: string) => void;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="overflow-hidden rounded-lg bg-navy-950 text-white shadow-resort">
        <div
          className="relative min-h-[430px] bg-cover bg-center sm:min-h-[520px]"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/35 via-navy-950/55 to-navy-950/90" />
          <div className="relative flex min-h-[430px] flex-col justify-end px-5 py-7 sm:min-h-[520px] sm:px-8 sm:py-10">
            <p className="text-sm font-semibold text-sunset-400">Operated by FABS Hospitality Group</p>
            <h1 className="mt-3 max-w-xl text-4xl font-bold leading-tight sm:text-5xl">Sunset Pointe Bar</h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-white/80">
              Scan the QR code, order from your phone, and pick up at the bar when it is ready.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Button fullWidth disabled={settings.orderingPaused} onClick={() => onNavigate("menu")}>
                <ShoppingBag size={19} />
                Pickup Order
              </Button>
              <Button fullWidth variant="secondary" onClick={() => onNavigate("menu")}>
                <MenuIcon size={19} />
                View Menu
              </Button>
              <Button fullWidth variant="secondary" onClick={() => onNavigate("status")}>
                <PackageCheck size={19} />
                Order Status
              </Button>
              <Button fullWidth variant="secondary" onClick={() => window.location.assign("tel:+13055550199")}>
                <Phone size={19} />
                Contact Bar
              </Button>
            </div>
          </div>
        </div>
      </section>

      <aside className="grid gap-4">
        <Notice settings={settings} />
        <div className="rounded-lg border border-navy-950/10 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-coral-100 text-coral-500">
              <MapPin size={21} />
            </div>
            <div>
              <h2 className="font-semibold">Pickup Instructions</h2>
              <p className="text-sm text-navy-900/70">Collect your order at Sunset Pointe Bar. Alcohol requires valid ID.</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-lg bg-foam p-3">
            <Clock3 size={20} className="text-sunset-500" />
            <p className="text-sm">
              Hours: {formatTime(settings.openingTime)} to {formatTime(settings.closingTime)}
            </p>
          </div>
          <Button className="mt-3" variant="ghost" onClick={() => onNavigate("admin")}>
            <LockKeyhole size={18} />
            Staff Login
          </Button>
        </div>
      </aside>

      <section className="lg:col-span-2">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold">Guest Favorites</h2>
          <Button variant="ghost" onClick={() => onNavigate("menu")}>
            View All
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featuredItems.map((item) => (
            <MenuCard item={item} key={item.id} onAdd={onAdd} disabled={settings.orderingPaused} />
          ))}
        </div>
      </section>
    </div>
  );
}

function MenuPage({
  activeCategory,
  items,
  settings,
  onCategoryChange,
  onAdd,
}: {
  activeCategory: string;
  items: MenuItem[];
  settings: BarSettings;
  onCategoryChange: (category: MenuCategory) => void;
  onAdd: (id: string) => void;
}) {
  return (
    <div className="grid gap-4">
      <Notice settings={settings} />
      <div className="flex gap-2 overflow-x-auto pb-1">
        {menuCategories.map((category) => (
          <button
            key={category}
            className={[
              "min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold transition",
              activeCategory === category
                ? "border-navy-950 bg-navy-950 text-white"
                : "border-navy-950/10 bg-white text-navy-900",
            ].join(" ")}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <MenuCard item={item} key={item.id} onAdd={onAdd} disabled={settings.orderingPaused} />
        ))}
      </div>
    </div>
  );
}

function CartPage({
  cart,
  menuItems,
  summary,
  onQuantityChange,
  onNavigate,
}: {
  cart: CartItem[];
  menuItems: MenuItem[];
  summary: ReturnType<typeof calculateCart>;
  onQuantityChange: (id: string, quantity: number) => void;
  onNavigate: (page: Page) => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <section className="rounded-lg border border-navy-950/10 bg-white p-4 shadow-sm">
        <h1 className="text-2xl font-bold">Cart</h1>
        {!cart.length ? (
          <div className="mt-6 rounded-lg bg-foam p-5 text-center">
            <ShoppingBag className="mx-auto text-sunset-500" size={34} />
            <p className="mt-3 font-semibold">Your cart is empty.</p>
            <Button className="mt-4" onClick={() => onNavigate("menu")}>
              View Menu
            </Button>
          </div>
        ) : (
          <div className="mt-4 grid gap-3">
            {cart.map((cartItem) => {
              const item = menuItems.find((menuItem) => menuItem.id === cartItem.itemId);
              if (!item) return null;
              return (
                <div className="flex items-center gap-3 rounded-lg bg-foam p-3" key={cartItem.itemId}>
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-navy-900/65">{formatMoney(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="h-9 w-9 rounded-full border border-navy-950/10 bg-white font-bold"
                      onClick={() => onQuantityChange(item.id, cartItem.quantity - 1)}
                      aria-label={`Remove one ${item.name}`}
                    >
                      -
                    </button>
                    <span className="w-7 text-center font-bold">{cartItem.quantity}</span>
                    <button
                      className="h-9 w-9 rounded-full border border-navy-950/10 bg-white font-bold"
                      onClick={() => onQuantityChange(item.id, cartItem.quantity + 1)}
                      aria-label={`Add one ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <OrderSummary summary={summary}>
        <Button fullWidth disabled={!cart.length} onClick={() => onNavigate("checkout")}>
          Continue to Checkout
        </Button>
      </OrderSummary>
    </div>
  );
}

function OrderSummary({
  summary,
  children,
  deliveryFee = 0,
}: {
  summary: ReturnType<typeof calculateCart>;
  children?: ReactNode;
  deliveryFee?: number;
}) {
  const total = summary.total + deliveryFee;

  return (
    <aside className="h-fit rounded-lg border border-navy-950/10 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-bold">Order Summary</h2>
      <div className="mt-4 grid gap-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatMoney(summary.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>{formatMoney(summary.tax)}</span>
        </div>
        {deliveryFee ? (
          <div className="flex justify-between">
            <span>Delivery fee</span>
            <span>{formatMoney(deliveryFee)}</span>
          </div>
        ) : null}
        <div className="flex justify-between border-t border-navy-950/10 pt-3 text-base font-bold">
          <span>Total</span>
          <span>{formatMoney(total)}</span>
        </div>
      </div>
      {summary.hasAlcohol ? (
        <div className="mt-4 rounded-lg bg-coral-100 p-3 text-sm leading-6 text-navy-900">
          <p className="font-bold">Alcohol pickup only at the bar during Phase 1.</p>
          <p>Valid ID is required at pickup. Unattended alcohol delivery is not allowed.</p>
        </div>
      ) : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </aside>
  );
}

function CheckoutPage({
  form,
  settings,
  summary,
  onChange,
  onSubmit,
}: {
  form: CheckoutForm;
  settings: BarSettings;
  summary: ReturnType<typeof calculateCart>;
  onChange: (form: CheckoutForm) => void;
  onSubmit: () => void;
}) {
  const deliveryEnabled = settings.roomServiceEnabled && !summary.hasAlcohol;
  const deliveryFee = form.orderType === "Room Delivery" && deliveryEnabled ? settings.deliveryFee : 0;
  const providerNames = paymentProviderOptions.map((provider) => provider.label).join(" or ");
  const canSubmit = Boolean(
    summary.lines.length > 0 &&
      !settings.orderingPaused &&
      form.guestName.trim() &&
      form.roomNumber.trim() &&
      form.phone.trim() &&
      form.pickupTime &&
      (!summary.hasAlcohol || form.ageConfirmed) &&
      (form.orderType === "Pickup" ||
        (deliveryEnabled && summary.subtotal >= settings.roomServiceMinimum)),
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <section className="rounded-lg border border-navy-950/10 bg-white p-4 shadow-sm">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <div className="mt-4 grid gap-4">
          <Input label="Name" value={form.guestName} onChange={(guestName) => onChange({ ...form, guestName })} />
          <Input label="Room number" value={form.roomNumber} onChange={(roomNumber) => onChange({ ...form, roomNumber })} />
          <Input label="Phone number" value={form.phone} onChange={(phone) => onChange({ ...form, phone })} />
          <Input
            label="Pickup time"
            type="time"
            min={settings.openingTime}
            max={settings.closingTime}
            value={form.pickupTime}
            onChange={(pickupTime) => onChange({ ...form, pickupTime })}
          />

          <div>
            <p className="mb-2 text-sm font-semibold">Order type</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                className={[
                  "min-h-14 rounded-lg border px-4 text-left text-sm font-semibold",
                  form.orderType === "Pickup"
                    ? "border-navy-950 bg-navy-950 text-white"
                    : "border-navy-950/10 bg-foam text-navy-900",
                ].join(" ")}
                onClick={() => onChange({ ...form, orderType: "Pickup" })}
              >
                Pickup
                <span className="block text-xs font-medium opacity-75">Available now</span>
              </button>
              <button
                className={[
                  "min-h-14 rounded-lg border px-4 text-left text-sm font-semibold",
                  form.orderType === "Room Delivery"
                    ? "border-navy-950 bg-navy-950 text-white"
                    : "border-navy-950/10 bg-foam text-navy-900",
                  deliveryEnabled ? "" : "opacity-55",
                ].join(" ")}
                disabled={!deliveryEnabled}
                onClick={() => onChange({ ...form, orderType: "Room Delivery" })}
              >
                Room Delivery
                <span className="block text-xs font-medium opacity-75">
                  {settings.roomServiceEnabled
                    ? `${formatMoney(settings.deliveryFee)} fee, ${formatMoney(settings.roomServiceMinimum)} min`
                    : "Coming soon after Day 90"}
                </span>
              </button>
            </div>
            {summary.hasAlcohol ? (
              <p className="mt-2 text-xs font-semibold text-coral-500">Alcohol orders remain pickup only.</p>
            ) : null}
            {form.orderType === "Room Delivery" && summary.subtotal < settings.roomServiceMinimum ? (
              <p className="mt-2 text-xs font-semibold text-coral-500">
                Room delivery minimum is {formatMoney(settings.roomServiceMinimum)}.
              </p>
            ) : null}
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold">Payment</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {(["Pay at Pickup", "Room Charge Placeholder"] as const).map((paymentMethod) => (
                <button
                  className={[
                    "min-h-14 rounded-lg border px-4 text-left text-sm font-semibold",
                    form.paymentMethod === paymentMethod
                      ? "border-navy-950 bg-navy-950 text-white"
                      : "border-navy-950/10 bg-foam text-navy-900",
                  ].join(" ")}
                  key={paymentMethod}
                  onClick={() => onChange({ ...form, paymentMethod })}
                >
                  {paymentMethod}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-navy-900/60">
              Payment-ready for {providerNames}; MVP supports pay at pickup and room charge placeholder.
            </p>
          </div>

          {summary.hasAlcohol ? (
            <label className="flex gap-3 rounded-lg bg-coral-100 p-4 text-sm leading-6">
              <input
                className="mt-1 h-5 w-5"
                type="checkbox"
                checked={form.ageConfirmed}
                onChange={(event) => onChange({ ...form, ageConfirmed: event.target.checked })}
              />
              <span>I confirm I am 21+ and will present valid ID at pickup.</span>
            </label>
          ) : null}
          {settings.orderingPaused ? (
            <div className="rounded-lg bg-coral-100 p-4 text-sm font-semibold text-navy-900">
              Ordering is paused by staff.
            </div>
          ) : null}
        </div>
      </section>

      <OrderSummary summary={summary} deliveryFee={deliveryFee}>
        <Button fullWidth disabled={!canSubmit} onClick={onSubmit}>
          Submit Order
        </Button>
      </OrderSummary>
    </div>
  );
}

function Input({
  label,
  value,
  type = "text",
  min,
  max,
  onChange,
}: {
  label: string;
  value: string;
  type?: string;
  min?: string;
  max?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        className="mt-2 h-12 w-full rounded-lg border border-navy-950/10 bg-white px-3 text-base outline-none ring-sunset-500/30 transition focus:ring-4"
        type={type}
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function ConfirmationPage({ order, onNavigate }: { order: Order | null; onNavigate: (page: Page) => void }) {
  if (!order) {
    return (
      <section className="rounded-lg border border-navy-950/10 bg-white p-5 text-center shadow-sm">
        <ReceiptText className="mx-auto text-sunset-500" size={34} />
        <p className="mt-3 font-semibold">No recent order found.</p>
        <Button className="mt-4" onClick={() => onNavigate("home")}>
          Home
        </Button>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-navy-950/10 bg-white p-5 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sunset-100 text-sunset-500">
        <ReceiptText size={31} />
      </div>
      <p className="mt-4 text-sm font-bold uppercase tracking-wide text-sunset-500">Order Confirmed</p>
      <h1 className="mt-2 text-3xl font-bold">{order.id}</h1>
      <p className="mx-auto mt-3 max-w-md text-navy-900/70">
        Pickup available at Sunset Pointe Bar at {formatTime(order.pickupTime)}. Bring your room number and valid ID for
        alcohol items.
      </p>
      <div className="mx-auto mt-5 max-w-sm rounded-lg bg-foam p-4 text-left">
        <p className="font-semibold">{order.guestName}</p>
        <p className="text-sm text-navy-900/70">Room {order.roomNumber}</p>
        <p className="mt-3 text-sm font-bold">Status: {order.status}</p>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Button onClick={() => onNavigate("status")}>Track Order</Button>
        <Button variant="secondary" onClick={() => onNavigate("home")}>
          Home
        </Button>
      </div>
    </section>
  );
}

function StatusPage({
  lookup,
  order,
  onLookupChange,
}: {
  lookup: string;
  order?: Order;
  onLookupChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-4">
      <section className="rounded-lg border border-navy-950/10 bg-white p-4 shadow-sm">
        <h1 className="text-2xl font-bold">Order Status</h1>
        <p className="mt-2 text-sm text-navy-900/70">Enter your confirmation number.</p>
        <div className="mt-4 flex gap-2">
          <input
            className="h-12 min-w-0 flex-1 rounded-lg border border-navy-950/10 px-3 text-base uppercase outline-none ring-sunset-500/30 transition focus:ring-4"
            placeholder="SPB-1043"
            value={lookup}
            onChange={(event) => onLookupChange(event.target.value)}
          />
          <Button aria-label="Search" title="Search">
            <Search size={20} />
          </Button>
        </div>
      </section>

      {order ? (
        <OrderCard order={order} />
      ) : lookup ? (
        <div className="rounded-lg bg-coral-100 p-4 text-sm font-semibold text-navy-900">No order found for that ID.</div>
      ) : null}
    </div>
  );
}

function AdminLoginPage({
  password,
  error,
  onPasswordChange,
  onSubmit,
}: {
  password: string;
  error: string;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <section className="mx-auto max-w-md rounded-lg border border-navy-950/10 bg-white p-5 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-950 text-white">
        <LockKeyhole size={22} />
      </div>
      <h1 className="mt-4 text-2xl font-bold">Admin Login</h1>
      <p className="mt-2 text-sm text-navy-900/70">Staff access for Sunset Pointe Bar operations.</p>
      <div className="mt-5 grid gap-3">
        <Input label="Password" type="password" value={password} onChange={onPasswordChange} />
        {error ? <p className="text-sm font-semibold text-coral-500">{error}</p> : null}
        <Button onClick={onSubmit}>Sign In</Button>
      </div>
    </section>
  );
}

function AdminDashboardPage({
  orders,
  openOrders,
  completedSales,
  settings,
  onStatusChange,
  onNavigate,
  onExport,
}: {
  orders: Order[];
  openOrders: number;
  completedSales: number;
  settings: BarSettings;
  onStatusChange: (id: string, status: OrderStatus) => void;
  onNavigate: (page: Page) => void;
  onExport: () => void;
}) {
  return (
    <div className="grid gap-4">
      <section className="grid gap-3 sm:grid-cols-3">
        <Metric icon={<PanelRightOpen size={20} />} label="Open Orders" value={String(openOrders)} />
        <Metric icon={<BadgeDollarSign size={20} />} label="Daily Sales" value={formatMoney(completedSales)} />
        <Metric
          icon={settings.orderingPaused ? <BellOff size={20} /> : <Clock3 size={20} />}
          label="Ordering"
          value={settings.orderingPaused ? "Paused" : "Active"}
        />
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <Button variant="secondary" onClick={() => onNavigate("menu-management")}>
          <SlidersHorizontal size={19} />
          Menu Management
        </Button>
        <Button variant="secondary" onClick={() => onNavigate("settings")}>
          <Settings size={19} />
          Settings
        </Button>
        <Button variant="secondary" onClick={onExport}>
          <Download size={19} />
          Export Sales
        </Button>
      </section>

      <section className="grid gap-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Incoming Orders</h1>
          <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-navy-900 shadow-sm">
            Pickup Phase
          </span>
        </div>
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} onStatusChange={(status) => onStatusChange(order.id, status)} />
        ))}
      </section>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-navy-950/10 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3 text-sunset-500">{icon}</div>
      <p className="mt-3 text-sm text-navy-900/60">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

function MenuManagementPage({
  items,
  onChange,
}: {
  items: MenuItem[];
  onNavigate: (page: Page) => void;
  onChange: (items: MenuItem[]) => void;
}) {
  const [newItem, setNewItem] = useState<MenuItem>(createBlankMenuItem());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const addItem = () => {
    if (!newItem.name.trim()) return;
    const item = {
      ...newItem,
      id: createMenuItemId(newItem.name),
      name: newItem.name.trim(),
      description: newItem.description.trim(),
      price: Number(newItem.price) || 0,
      imageUrl: newItem.imageUrl?.trim() || undefined,
    };
    onChange([item, ...items]);
    setNewItem(createBlankMenuItem(item.category));
  };

  const startEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setEditingItem({ ...item });
  };

  const saveEdit = () => {
    if (!editingId || !editingItem?.name.trim()) return;
    onChange(
      items.map((item) =>
        item.id === editingId
          ? {
              ...editingItem,
              name: editingItem.name.trim(),
              description: editingItem.description.trim(),
              price: Number(editingItem.price) || 0,
              imageUrl: editingItem.imageUrl?.trim() || undefined,
            }
          : item,
      ),
    );
    setEditingId(null);
    setEditingItem(null);
  };

  const deleteItem = (itemId: string) => {
    const item = items.find((candidate) => candidate.id === itemId);
    if (!item) return;
    if (window.confirm(`Delete ${item.name}?`)) {
      onChange(items.filter((candidate) => candidate.id !== itemId));
    }
  };

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-sunset-500">Admin</p>
          <h1 className="text-2xl font-bold">Menu Management</h1>
        </div>
        <Button variant="secondary" onClick={() => onChange(initialMenuItems)}>
          Reset Menu
        </Button>
      </div>

      <section className="rounded-lg border border-navy-950/10 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-bold">Add Menu Item</h2>
        <MenuItemForm item={newItem} onChange={setNewItem} onSubmit={addItem} submitLabel="Add Item" />
      </section>

      {menuCategories.map((category) => (
        <section className="rounded-lg border border-navy-950/10 bg-white p-4 shadow-sm" key={category}>
          <h2 className="text-lg font-bold">{category}</h2>
          <div className="mt-3 grid gap-3">
            {items
              .filter((item) => item.category === category)
              .map((item) => (
                <div className="rounded-lg bg-foam p-3" key={item.id}>
                  {editingId === item.id && editingItem ? (
                    <MenuItemForm
                      item={editingItem}
                      onChange={setEditingItem}
                      onSubmit={saveEdit}
                      onCancel={() => {
                        setEditingId(null);
                        setEditingItem(null);
                      }}
                      submitLabel="Save Changes"
                    />
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-[96px_1fr_auto] sm:items-center">
                      <MenuThumb item={item} />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold">{item.name}</p>
                          {item.featured ? (
                            <span className="rounded-full bg-sunset-100 px-2 py-1 text-[11px] font-bold text-navy-900">
                              Featured
                            </span>
                          ) : null}
                          {item.alcohol ? (
                            <span className="rounded-full bg-coral-100 px-2 py-1 text-[11px] font-bold text-navy-900">
                              21+
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm text-navy-900/60">{item.description}</p>
                        <p className="mt-2 text-sm font-bold">{formatMoney(item.price)}</p>
                        <FoodCostNote item={item} />
                      </div>
                      <div className="flex gap-2 sm:flex-col">
                        <Button variant="secondary" onClick={() => startEdit(item)}>
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => deleteItem(item.id)}>
                          <Trash2 size={17} />
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function createBlankMenuItem(category: MenuCategory = "Breakfast"): MenuItem {
  return {
    id: "",
    name: "",
    description: "",
    category,
    price: 0,
    cost: 0,
    imageUrl: "",
    available: true,
    alcohol: false,
    featured: false,
  };
}

function createMenuItemId(name: string) {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug || "menu-item"}-${Date.now().toString(36)}`;
}

function MenuItemForm({
  item,
  onChange,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  item: MenuItem;
  onChange: (item: MenuItem) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  submitLabel: string;
}) {
  const update = (patch: Partial<MenuItem>) => onChange({ ...item, ...patch });

  const uploadImage = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update({ imageUrl: String(reader.result ?? "") });
    reader.readAsDataURL(file);
  };

  return (
    <div className="mt-4 grid gap-4">
      <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
        <MenuThumb item={item} large />
        <div className="grid gap-3">
          <Input label="Item name" value={item.name} onChange={(name) => update({ name })} />
          <label className="block text-sm font-semibold">
            Description
            <textarea
              className="mt-2 min-h-24 w-full rounded-lg border border-navy-950/10 bg-white px-3 py-3 text-base outline-none ring-sunset-500/30 transition focus:ring-4"
              value={item.description}
              onChange={(event) => update({ description: event.target.value })}
            />
          </label>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block text-sm font-semibold">
          Category
          <select
            className="mt-2 h-12 w-full rounded-lg border border-navy-950/10 bg-white px-3 text-base"
            value={item.category}
            onChange={(event) => update({ category: event.target.value as MenuCategory })}
          >
            {menuCategories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <Input label="Price" type="number" value={String(item.price)} onChange={(price) => update({ price: Number(price) })} />
        <Input label="Dish cost" type="number" value={String(item.cost ?? 0)} onChange={(cost) => update({ cost: Number(cost) })} />
        <label className="block text-sm font-semibold">
          Image URL
          <input
            className="mt-2 h-12 w-full rounded-lg border border-navy-950/10 bg-white px-3 text-base outline-none ring-sunset-500/30 transition focus:ring-4"
            placeholder="https://..."
            value={item.imageUrl ?? ""}
            onChange={(event) => update({ imageUrl: event.target.value })}
          />
        </label>
      </div>

      <div className="rounded-lg bg-sunset-100 p-3 text-sm text-navy-900">
        <FoodCostNote item={item} expanded />
      </div>

      <label className="flex min-h-12 items-center gap-3 rounded-lg border border-dashed border-navy-950/20 bg-white px-4 text-sm font-semibold">
        <Image size={18} className="text-sunset-500" />
        Upload Image
        <input className="sr-only" type="file" accept="image/*" onChange={(event) => uploadImage(event.target.files?.[0])} />
      </label>

      <div className="grid gap-2 sm:grid-cols-3">
        <Toggle label="Available" checked={Boolean(item.available)} onChange={(available) => update({ available })} />
        <Toggle label="Featured" checked={Boolean(item.featured)} onChange={(featured) => update({ featured })} />
        <Toggle label="Alcohol item" checked={Boolean(item.alcohol)} onChange={(alcohol) => update({ alcohol })} />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button disabled={!item.name.trim()} onClick={onSubmit}>
          {submitLabel}
        </Button>
        {onCancel ? (
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function FoodCostNote({ item, expanded }: { item: Pick<MenuItem, "price" | "cost">; expanded?: boolean }) {
  const cost = Number(item.cost ?? 0);
  const price = Number(item.price ?? 0);
  const foodCostPercent = price > 0 ? (cost / price) * 100 : 0;
  const suggestedPrice = cost > 0 ? cost / 0.2 : 0;

  if (!cost || !price) {
    return (
      <p className={expanded ? "font-semibold" : "mt-1 text-xs text-navy-900/60"}>
        Add dish cost to calculate target pricing.
      </p>
    );
  }

  return (
    <p className={expanded ? "font-semibold" : "mt-1 text-xs text-navy-900/60"}>
      Cost {formatMoney(cost)} · Food cost {foodCostPercent.toFixed(1)}%
      {expanded ? ` · 20% target price ${formatMoney(suggestedPrice)}` : ""}
    </p>
  );
}

function MenuThumb({ item, large }: { item: Pick<MenuItem, "imageUrl" | "name" | "category">; large?: boolean }) {
  const sizeClass = large ? "aspect-[4/3] min-h-32" : "aspect-[4/3] min-h-20";

  if (item.imageUrl) {
    return (
      <div className={`${sizeClass} overflow-hidden rounded-lg bg-navy-950`}>
        <img className="h-full w-full object-cover" src={item.imageUrl} alt="" />
      </div>
    );
  }

  return (
    <div className={`${sizeClass} rounded-lg bg-gradient-to-br from-navy-950 via-sunset-500 to-coral-500 p-3 text-white`}>
      <div className="flex h-full items-end">
        <span className="text-xs font-bold">{item.name || item.category}</span>
      </div>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex min-h-12 items-center gap-3 rounded-lg bg-foam px-4 text-sm font-semibold">
      <input className="h-5 w-5" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}

function SettingsPage({
  settings,
  onChange,
}: {
  settings: BarSettings;
  onNavigate: (page: Page) => void;
  onChange: (settings: BarSettings) => void;
}) {
  const update = (patch: Partial<BarSettings>) => onChange({ ...settings, ...patch });

  return (
    <section className="rounded-lg border border-navy-950/10 bg-white p-4 shadow-sm">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="mt-5 grid gap-5">
        <label className="flex items-center justify-between gap-4 rounded-lg bg-foam p-4 text-sm font-semibold">
          Pause ordering
          <input
            className="h-6 w-6"
            type="checkbox"
            checked={settings.orderingPaused}
            onChange={(event) => update({ orderingPaused: event.target.checked })}
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Opening time"
            type="time"
            value={settings.openingTime}
            onChange={(openingTime) => update({ openingTime })}
          />
          <Input
            label="Closing time"
            type="time"
            value={settings.closingTime}
            onChange={(closingTime) => update({ closingTime })}
          />
        </div>

        <div className="rounded-lg bg-sunset-100 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 text-sunset-500">
              <Home size={21} />
            </div>
            <div>
              <h2 className="font-bold">Phase 2 Room Delivery</h2>
              <p className="mt-1 text-sm leading-6 text-navy-900/70">
                Enable after Day {settings.roomServiceStartDay}. Alcohol delivery remains attended handoff only and is not
                enabled for unattended delivery.
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                className="h-5 w-5"
                type="checkbox"
                checked={settings.roomServiceEnabled}
                onChange={(event) => update({ roomServiceEnabled: event.target.checked })}
              />
              Room delivery enabled
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                className="h-5 w-5"
                type="checkbox"
                checked={settings.roomServiceHoursEnabled}
                onChange={(event) => update({ roomServiceHoursEnabled: event.target.checked })}
              />
              Room service hours controlled
            </label>
            <Input
              label="Delivery fee"
              type="number"
              value={String(settings.deliveryFee)}
              onChange={(deliveryFee) => update({ deliveryFee: Number(deliveryFee) })}
            />
            <Input
              label="Minimum order"
              type="number"
              value={String(settings.roomServiceMinimum)}
              onChange={(roomServiceMinimum) => update({ roomServiceMinimum: Number(roomServiceMinimum) })}
            />
          </div>
        </div>

        <Button variant="secondary" onClick={() => onChange(initialSettings)}>
          Reset Settings
        </Button>
      </div>
    </section>
  );
}

function PrivacyPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <section className="rounded-lg border border-navy-950/10 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wide text-sunset-500">{primaryDomain}</p>
      <h1 className="mt-2 text-3xl font-bold">Privacy Policy</h1>
      <div className="mt-5 grid gap-4 text-sm leading-7 text-navy-900/75">
        <p>
          Sunset Pointe Bar collects only the information needed to prepare and manage guest pickup orders:
          guest name, room number, phone number, selected items, pickup time, payment method selection, order status,
          and timestamp.
        </p>
        <p>
          Guests do not need accounts. MVP order data is stored locally for demonstration and operational planning.
          A production backend should store order data securely, limit staff access, and retain data only as long as
          needed for service, reporting, and legal obligations.
        </p>
        <p>
          Alcohol orders require a 21+ confirmation and valid ID at pickup. Sunset Pointe Bar does not support
          unattended alcohol delivery.
        </p>
        <p>
          Payment integrations are prepared for Stripe or Square. Live card payments should be handled by the selected
          payment provider and not stored directly in this app.
        </p>
      </div>
      <Button className="mt-6" onClick={() => onNavigate("home")}>
        Back to Ordering
      </Button>
    </section>
  );
}

function TermsPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <section className="rounded-lg border border-navy-950/10 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wide text-sunset-500">{primaryDomain}</p>
      <h1 className="mt-2 text-3xl font-bold">Terms</h1>
      <div className="mt-5 grid gap-4 text-sm leading-7 text-navy-900/75">
        <p>
          Sunset Pointe Bar ordering is intended for Banana Bay Resort & Marina guests. Phase 1 supports pickup only at
          Sunset Pointe Bar. Room delivery is planned as a Phase 2 feature after Day 90 and can be enabled by staff.
        </p>
        <p>
          Menu availability, pricing, pickup times, operating hours, taxes, fees, and payment options may change.
          Orders are not final until confirmed by bar staff or the connected production ordering backend.
        </p>
        <p>
          Alcohol items are available only to guests who are 21 or older and present valid ID. Alcohol pickup is at the
          bar during Phase 1. Unattended alcohol delivery is not allowed.
        </p>
        <p>
          For questions, order changes, allergies, or urgent requests, contact Sunset Pointe Bar directly before pickup.
        </p>
      </div>
      <Button className="mt-6" onClick={() => onNavigate("home")}>
        Back to Ordering
      </Button>
    </section>
  );
}

function AdminGate({
  label = "Admin access required.",
  onNavigate,
}: {
  label?: string;
  onNavigate: (page: Page) => void;
}) {
  return (
    <section className="rounded-lg border border-navy-950/10 bg-white p-5 text-center shadow-sm">
      <LockKeyhole className="mx-auto text-sunset-500" size={34} />
      <p className="mt-3 font-semibold">{label}</p>
      <Button className="mt-4" onClick={() => onNavigate("admin")}>
        Admin Login
      </Button>
    </section>
  );
}
