import type { SyntheticEvent } from "react";
import { BadgeCheck, Plus, Wine } from "lucide-react";
import { Button } from "./Button";
import { formatMoney } from "../lib/format";
import type { MenuCategory, MenuItem } from "../types";

interface MenuCardProps {
  item: MenuItem;
  onAdd: (itemId: string) => void;
  disabled?: boolean;
}

export function MenuCard({ item, onAdd, disabled }: MenuCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-navy-950/10 bg-white shadow-sm">
      <MenuCardImage item={item} />
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
          <p className="mt-3 text-base font-bold text-navy-950">{formatMoney(item.price)}</p>
        </div>
        <Button
          aria-label={`Add ${item.name}`}
          title={`Add ${item.name}`}
          disabled={!item.available || disabled}
          className="mr-4 mt-4 h-11 min-h-0 w-11 shrink-0 rounded-full p-0"
          onClick={() => onAdd(item.id)}
        >
          <Plus size={19} />
        </Button>
      </div>
      {!item.available ? <p className="px-4 pb-4 text-sm font-semibold text-coral-500">Temporarily unavailable</p> : null}
      {disabled && item.available ? <p className="px-4 pb-4 text-sm font-semibold text-coral-500">Ordering paused</p> : null}
    </article>
  );
}

const categoryGradient: Record<MenuCategory, string> = {
  Breakfast: "from-sunset-500 via-coral-500 to-white",
  "Coffee & Juice": "from-navy-950 via-sunset-500 to-white",
  "Frozen Drinks": "from-coral-500 via-white to-sunset-500",
  "Beer & Wine": "from-navy-950 via-coral-500 to-sunset-500",
  "Sunset Cocktails": "from-navy-950 via-sunset-500 to-coral-500",
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
      <div className="aspect-[16/9] overflow-hidden bg-navy-950">
        <img
          className="h-full w-full object-cover"
          src={item.imageUrl}
          alt={`${item.name} at Sunset Pointe Bar`}
          loading="lazy"
          onError={replaceBrokenMenuImage}
        />
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
