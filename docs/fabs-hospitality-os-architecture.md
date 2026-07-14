# FABS Hospitality OS Architecture

This app is the first configurable deployment of FABS Hospitality OS. Banana Bay is Deployment 1, not the long-term boundary of the product.

Architecture rule:

```text
Do not optimize for Banana Bay. Optimize for the next 100 resorts without breaking Banana Bay today.
```

## Core Entities

- `Property`: the resort, hotel, club, marina, or hospitality asset.
- `Venue`: a physical or branded place inside a property.
- `Experience`: a guest-facing moment such as breakfast, poolside dining, sunset bar, or private dining.
- `RevenueCenter`: the reporting and optimization layer. Analytics should group by revenue center, not just menu category.
- `OperatingWindow`: configurable hours tied to a venue or experience.
- `FulfillmentMethod`: how a guest receives the order, such as marketplace pickup, pool pickup, chair delivery, dine-in, or reservation-only.
- `MenuItem`: sellable food or beverage item. It can point to property, venue, experience, revenue center, and fulfillment methods.
- `InventoryItem`: marketplace or retail item sold by unit, cup, bottle, weight, market price, or variable weight.
- `ReservationExperience`: premium guest experience such as Amicasa.
- `EventAnnouncement`: live content for the Sunset Feed.

## Product Objective

The objective is not to build the best restaurant ordering app.

The objective is to build a configurable hospitality operating system that can be deployed repeatedly across resorts, marinas, boutique hotels, clubs, and hospitality venues.

Every architectural decision should support:

- repeatability
- operational simplicity
- measurable financial performance
- guest satisfaction
- on-property revenue capture
- labor productivity
- property value

## Hospitality Before Technology

Technology should not become the guest experience. It should quietly support hospitality.

Guests should remember the experience, not the app.

Before adding any feature, apply this filter:

```text
Does this help the guest?
Does this help the operator?
Does this increase revenue or reduce operational complexity?
```

If the answer is not clear, reconsider the feature.

## Operator-First Admin

Admin tools are designed for people running a busy hospitality operation, not for engineers.

The interface should require as few clicks as possible and should be learnable by a manager in minutes.

Future admin work should prioritize:

- speed
- clear status
- low training burden
- daily operational control
- fewer manual handoffs

## FABS Hospitality Principles

1. Hospitality before technology.
2. Every guest touchpoint should create value.
3. Every revenue center should strengthen another.
4. Labor follows demand, not assumptions.
5. Simplicity scales.
6. Design for repeatability.
7. Protect the guest journey.
8. Measure what matters.
9. Build assets, not dependencies.
10. Leave every property stronger than you found it.

## Configuration Boundary

Banana Bay and Sunset Pointe copy now belongs in configuration, currently `src/data/hospitality.ts`, rather than inside generic UI components.

Future deployments should be created by adding configuration for:

- property identity and domain
- venues
- experiences
- revenue centers
- operating windows
- fulfillment methods
- reservation experiences
- live guest announcements

## Marketplace Positioning

The marketplace is not a convenience store. It is the guest convenience and revenue capture center.

Purpose:

```text
Eliminate reasons for guests to leave the property while increasing guest satisfaction and average spend throughout the day.
```

This supports the revenue logic:

```text
Comfort -> Time on property -> More purchase opportunities -> Higher guest spend
```

## Analytics Direction

The admin dashboard should evolve around revenue centers:

- Breakfast
- Pool Marketplace
- Pool Dining
- Sunset Bar
- Sunset Dining
- Amicasa
- Retail
- Private Events

The current implementation calculates revenue-center totals from existing order line items and menu item metadata. A production backend should persist these IDs directly on orders, reservations, inventory, and sales records.

The platform should evolve from reporting sales to helping operators make decisions:

- which revenue center is outperforming today
- which menu items are driving profit
- which operating windows are underperforming
- which experiences generate repeat visits
- which inventory items require replenishment
- where guests are dropping out of the daily journey

Longer-term architecture should support seasonal menus, occupancy-driven staffing, dynamic operating hours, event scheduling, promotions, inventory forecasting, and guest preferences.

## Deployment Wizard Direction

The eventual platform should support a deployment wizard that asks property-level questions:

- number of rooms
- pool
- marina
- beach
- restaurant
- existing bar
- breakfast included
- private dining
- marketplace
- outdoor kitchen

The wizard should generate the starter venue structure, operating hours, QR ordering, proposal template, capital deployment checklist, and SOP checklist.

This is not implemented yet. The current refactor creates the configuration model that makes it possible later.
