import { ArrowLeft, ConciergeBell, ShoppingBag } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./Button";
import type { Page } from "../types";

interface AppShellProps {
  children: ReactNode;
  page: Page;
  cartCount: number;
  onNavigate: (page: Page) => void;
  onBack?: () => void;
}

export function AppShell({ children, page, cartCount, onNavigate, onBack }: AppShellProps) {
  const showBack = page !== "home";

  return (
    <div className="min-h-screen bg-foam text-navy-950">
      <header className="sticky top-0 z-20 border-b border-white/20 bg-navy-950 text-white shadow-lg shadow-navy-950/10">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          {showBack ? (
            <Button
              aria-label="Back"
              title="Back"
              variant="ghost"
              className="h-11 min-h-0 w-11 rounded-full p-0 text-white hover:bg-white/10"
              onClick={onBack}
            >
              <ArrowLeft size={20} />
            </Button>
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sunset-500 text-navy-950">
              <ConciergeBell size={21} />
            </div>
          )}

          <button className="min-w-0 flex-1 text-left" onClick={() => onNavigate("home")}>
            <p className="truncate text-base font-semibold leading-tight">Sunset Pointe Bar</p>
            <p className="truncate text-xs text-white/70">Banana Bay Resort & Marina</p>
          </button>

          <button
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white"
            onClick={() => onNavigate("cart")}
            aria-label="Cart"
            title="Cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-coral-500 px-1 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            ) : null}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-10 pt-4 sm:pt-8">{children}</main>
      <footer className="mx-auto max-w-5xl px-4 pb-10 text-sm text-navy-900/60">
        <div className="flex flex-wrap gap-4 border-t border-navy-950/10 pt-5">
          <button className="font-semibold" onClick={() => onNavigate("privacy")}>
            Privacy
          </button>
          <button className="font-semibold" onClick={() => onNavigate("terms")}>
            Terms
          </button>
          <button className="font-semibold" onClick={() => onNavigate("admin")}>
            Admin
          </button>
          <span>sunsetpointebar.com</span>
        </div>
      </footer>
    </div>
  );
}
