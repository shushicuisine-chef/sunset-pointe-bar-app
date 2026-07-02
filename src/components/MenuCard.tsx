import type { SyntheticEvent } from "react";
import { BadgeCheck, Maximize2, Plus, Wine, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./Button";
import { formatMoney } from "../lib/format";
import type { MenuCategory, MenuItem } from "../types";

interface MenuCardProps {
  item: MenuItem;
  onAdd: (itemId: string) => void;
  disabled?: boolean;
}

export function MenuCard({ item, onAdd, disabled }: MenuCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const addItem = () => {
    onAdd(item.id);
  };

  return (
    <>
      <article className="overflow-hidden rounded-lg border border-navy-950/10 bg-white shadow-sm">
        <button
          className="block w-full text-left"
          type="button"
          onClick={() => setIsDetailOpen(true)}
          aria-label={`View ${item.name} details`}
        >
          <MenuCardImage item={item} />
        </button>
        <div className="flex items-start gap-3">
          <div className="flex-1 p-4 pr-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-navy-950">{item.name}</h3>
              {item.featured ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-sunset-100 px-2 py-1 text-[11px] font-bold text-navy-900">
                  <BadgeCheck size={13} />
                  House Pick
                </span>
              ) : null}
              {item.alcohol ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-coral-100 px-2 py-1 text-[11px] font-bold text-navy-900">
                  <Wine size={13} />
                  21+
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-sm leading-6 text-navy-900/70">{item.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <p className="text-base font-bold text-navy-950">{formatMoney(item.price)}</p>
              <button
                className="inline-flex items-center gap-1 text-sm font-bold text-sunset-500"
                type="button"
                onClick={() => setIsDetailOpen(true)}
              >
                <Maximize2 size={15} />
                View
              </button>
            </div>
          </div>
          <Button
            aria-label={`Add ${item.name}`}
            title={`Add ${item.name}`}
            disabled={!item.available || disabled}
            className="mr-4 mt-4 h-11 min-h-0 w-11 shrink-0 rounded-full p-0"
            onClick={addItem}
          >
            <Plus size={19} />
          </Button>
        </div>
        {!item.available ? <p className="px-4 pb-4 text-sm font-semibold text-coral-500">Temporarily unavailable</p> : null}
        {disabled && item.available ? <p className="px-4 pb-4 text-sm font-semibold text-coral-500">Ordering paused</p> : null}
      </article>

      {isDetailOpen ? (
        <MenuItemDetailModal
          disabled={disabled}
          item={item}
          onAdd={addItem}
          onClose={() => setIsDetailOpen(false)}
        />
      ) : null}
    </>
  );
}

const categoryGradient: Record<MenuCategory, string> = {
  Breakfast: "from-sunset-500 via-coral-500 to-white",
  "Coffee & Juice": "from-navy-950 via-sunset-500 to-white",
  Slushies: "from-coral-500 via-white to-sunset-500",
  "Beer & Wine": "from-navy-950 via-coral-500 to-sunset-500",
  "Sunset Refreshers": "from-navy-950 via-sunset-500 to-coral-500",
  "Surf & Turf Bites": "from-white via-foam to-sunset-500",
  "Smoked Meats": "from-navy-950 via-sunset-500 to-coral-500",
  "Poolside Favorites": "from-sunset-500 via-white to-coral-500",
};

const MENU_IMAGE_FALLBACK = "/menu-images/default.svg";

function replaceBrokenMenuImage(event: SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;
  if (image.dataset.fallbackImage === "true") return;
  image.dataset.fallbackImage = "true";
  image.src = MENU_IMAGE_FALLBACK;
  image.alt = "Sunset Pointe Bar menu placeholder";
}

function MenuCardImage({ item }: { item: MenuItem }) {
  if (item.imageUrl) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden bg-sunset-100">
        <img
          className="h-full w-full object-contain"
          src={item.imageUrl}
          alt={`${item.name} at Sunset Pointe Bar`}
          loading="lazy"
          onError={replaceBrokenMenuImage}
        />
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-navy-950 shadow-sm">
          <Maximize2 size={13} />
          View
        </span>
      </div>
    );
  }

  return (
    <div className={`aspect-[16/9] bg-gradient-to-br ${categoryGradient[item.category]}`}>
      <div className="flex h-full items-end justify-between bg-navy-950/15 p-4">
        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-navy-950">{item.category}</span>
        <span className="h-9 w-9 rounded-full border border-white/70 bg-white/25" />
      </div>
    </div>
  );
}

function MenuItemDetailModal({
  item,
  disabled,
  onAdd,
  onClose,
}: {
  item: MenuItem;
  disabled?: boolean;
  onAdd: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-navy-950/70 p-3 sm:items-center sm:justify-center">
      <div className="max-h-[92vh] w-full overflow-hidden rounded-lg bg-white shadow-resort sm:max-w-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-navy-950/10 px-4 py-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-sunset-500">{item.category}</p>
            <h2 className="text-lg font-bold text-navy-950">{item.name}</h2>
          </div>
          <button
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foam text-navy-950"
            type="button"
            onClick={onClose}
            aria-label="Close item details"
          >
            <X size={20} />
          </button>
        </div>
        <div className="max-h-[calc(92vh-73px)] overflow-y-auto">
          {item.imageUrl ? (
            <div className="bg-sunset-100 p-2">
              <img
                className="mx-auto max-h-[58vh] w-full object-contain"
                src={item.imageUrl}
                alt={`${item.name} at Sunset Pointe Bar`}
                onError={replaceBrokenMenuImage}
              />
            </div>
          ) : null}
          <div className="grid gap-4 p-4">
            <div className="flex flex-wrap items-center gap-2">
              {item.featured ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-sunset-100 px-2 py-1 text-[11px] font-bold text-navy-900">
                  <BadgeCheck size={13} />
                  House Pick
                </span>
              ) : null}
              {item.alcohol ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-coral-100 px-2 py-1 text-[11px] font-bold text-navy-900">
                  <Wine size={13} />
                  21+
                </span>
              ) : null}
            </div>
            <p className="text-sm leading-6 text-navy-900/70">{item.description}</p>
            <div className="flex items-center justify-between gap-4">
              <p className="text-xl font-bold text-navy-950">{formatMoney(item.price)}</p>
              <Button disabled={!item.available || disabled} onClick={onAdd}>
                <Plus size={18} />
                Add
              </Button>
            </div>
            {!item.available ? <p className="text-sm font-semibold text-coral-500">Temporarily unavailable</p> : null}
            {disabled && item.available ? <p className="text-sm font-semibold text-coral-500">Ordering paused</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
