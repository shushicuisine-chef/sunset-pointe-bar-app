import type {
  EventAnnouncement,
  Experience,
  FulfillmentMethod,
  OperatingWindow,
  Property,
  ReservationExperience,
  RevenueCenter,
  Venue,
} from "../types";

export const activePropertyId = "banana-bay";

export const properties: Property[] = [
  {
    id: activePropertyId,
    name: "Banana Bay Resort & Marina",
    shortName: "Banana Bay",
    domain: "sunsetpointebar.com",
    roomCount: 59,
    brandName: "Sunset Pointe",
    operatorName: "FABS Hospitality Group",
    description:
      "The first deployment of FABS Hospitality OS, coordinating guest experiences across breakfast, poolside, sunset, dining, marketplace, and private events.",
  },
];

export const venues: Venue[] = [
  {
    id: "breakfast-service",
    propertyId: activePropertyId,
    name: "Breakfast Buffet",
    description: "Morning amenity experience designed to support reviews, ADR, and the first guest touchpoint of the day.",
  },
  {
    id: "pool-mini-mercado",
    propertyId: activePropertyId,
    name: "Pool Bar & Mini Mercado",
    description: "A premium coastal marketplace for slushies, chilled beverages, grab-and-go products, and resort essentials.",
  },
  {
    id: "poolside-dining",
    propertyId: activePropertyId,
    name: "Poolside Dining",
    description: "QR/app ordering for composed bites prepared by the Sunset Pointe kitchen and served for pool pickup or chair delivery.",
  },
  {
    id: "sunset-pointe-bar",
    propertyId: activePropertyId,
    name: "Sunset Pointe Bar",
    description: "The waterfront beverage and social activation layer for sunset drinks, refreshers, beer, wine, and pickup orders.",
  },
  {
    id: "sunset-pointe-dining",
    propertyId: activePropertyId,
    name: "Sunset Pointe Dining",
    description: "Hands-on coastal dining built around fire, smoke, Sushi, ShuShi, composed bites, and land-and-ocean pairings.",
  },
  {
    id: "amicasa",
    propertyId: activePropertyId,
    name: "Amicasa",
    description: "Reservation-only private dining for up to 12 guests.",
  },
];

export const revenueCenters: RevenueCenter[] = [
  {
    id: "breakfast",
    propertyId: activePropertyId,
    venueId: "breakfast-service",
    name: "Breakfast",
    description: "Amenity-supported morning program and future public breakfast layer.",
  },
  {
    id: "pool-marketplace",
    propertyId: activePropertyId,
    venueId: "pool-mini-mercado",
    name: "Pool Marketplace",
    description: "Slushies, packaged beverages, grab-and-go foods, retail, and resort essentials.",
  },
  {
    id: "pool-dining",
    propertyId: activePropertyId,
    venueId: "poolside-dining",
    name: "Pool Dining",
    description: "Poolside QR ordering, pool pickup, and chair delivery.",
  },
  {
    id: "sunset-bar",
    propertyId: activePropertyId,
    venueId: "sunset-pointe-bar",
    name: "Sunset Bar",
    description: "Waterfront bar revenue from beer, wine, slushies, refreshers, and beverage programming.",
  },
  {
    id: "sunset-dining",
    propertyId: activePropertyId,
    venueId: "sunset-pointe-dining",
    name: "Sunset Dining",
    description: "Culinary revenue from Surf & Turf Bites, wood fire, smoked land and ocean, Sushi, ShuShi, and sweets.",
  },
  {
    id: "amicasa",
    propertyId: activePropertyId,
    venueId: "amicasa",
    name: "Amicasa",
    description: "Private dining and chef-guided tasting revenue.",
  },
  {
    id: "retail",
    propertyId: activePropertyId,
    venueId: "pool-mini-mercado",
    name: "Retail",
    description: "Take Sunset Home products, resort retail, packaged goods, sauces, rubs, and products by weight.",
  },
];

export const operatingWindows: OperatingWindow[] = [
  {
    id: "breakfast-7-10",
    propertyId: activePropertyId,
    venueId: "breakfast-service",
    experienceId: "breakfast-buffet",
    label: "7:00 AM-10:00 AM",
    startTime: "07:00",
    endTime: "10:00",
  },
  {
    id: "pool-marketplace-11-7",
    propertyId: activePropertyId,
    venueId: "pool-mini-mercado",
    experienceId: "pool-mini-mercado",
    label: "11:00 AM-7:00 PM",
    startTime: "11:00",
    endTime: "19:00",
  },
  {
    id: "poolside-dining-11-4",
    propertyId: activePropertyId,
    venueId: "poolside-dining",
    experienceId: "poolside-dining",
    label: "11:00 AM-4:00 PM",
    startTime: "11:00",
    endTime: "16:00",
  },
  {
    id: "sunset-bar-3-10",
    propertyId: activePropertyId,
    venueId: "sunset-pointe-bar",
    experienceId: "sunset-pointe-bar",
    label: "3:00 PM-10:00 PM",
    startTime: "15:00",
    endTime: "22:00",
  },
  {
    id: "sunset-dining-5-9",
    propertyId: activePropertyId,
    venueId: "sunset-pointe-dining",
    experienceId: "sunset-pointe-dining",
    label: "5:00 PM-9:00 PM",
    startTime: "17:00",
    endTime: "21:00",
  },
];

export const experiences: Experience[] = [
  {
    id: "breakfast-buffet",
    propertyId: activePropertyId,
    venueId: "breakfast-service",
    revenueCenterId: "breakfast",
    name: "Complimentary Breakfast Buffet",
    description: "Morning guest amenity supporting reviews, guest satisfaction, and the daily hospitality rhythm.",
    operatingWindowId: "breakfast-7-10",
  },
  {
    id: "pool-mini-mercado",
    propertyId: activePropertyId,
    venueId: "pool-mini-mercado",
    revenueCenterId: "pool-marketplace",
    name: "Pool Bar & Mini Mercado",
    description: "Slushies, chilled beverages, gourmet grab-and-go, retail, and take-home products.",
    operatingWindowId: "pool-marketplace-11-7",
    orderEnabled: true,
  },
  {
    id: "poolside-dining",
    propertyId: activePropertyId,
    venueId: "poolside-dining",
    revenueCenterId: "pool-dining",
    name: "Poolside Dining",
    description: "Order composed coastal bites from your phone for pool pickup or chair delivery.",
    operatingWindowId: "poolside-dining-11-4",
    orderEnabled: true,
  },
  {
    id: "sunset-pointe-bar",
    propertyId: activePropertyId,
    venueId: "sunset-pointe-bar",
    revenueCenterId: "sunset-bar",
    name: "Sunset Pointe Bar",
    description: "Waterfront drinks, refreshers, wine, beer, and sunset social energy.",
    operatingWindowId: "sunset-bar-3-10",
    orderEnabled: true,
  },
  {
    id: "sunset-pointe-dining",
    propertyId: activePropertyId,
    venueId: "sunset-pointe-dining",
    revenueCenterId: "sunset-dining",
    name: "Sunset Pointe Dining",
    description: "Hands-on coastal dining built around composed bites, fire, smoke, Sushi, ShuShi, and land-and-ocean pairings.",
    operatingWindowId: "sunset-dining-5-9",
    orderEnabled: true,
  },
  {
    id: "amicasa",
    propertyId: activePropertyId,
    venueId: "amicasa",
    revenueCenterId: "amicasa",
    name: "Amicasa Private Dining",
    description: "Reservation-only chef-guided tasting experience for up to 12 guests.",
    reservationEnabled: true,
    capacity: 12,
  },
];

export const fulfillmentMethods: FulfillmentMethod[] = [
  {
    id: "marketplace-pickup",
    propertyId: activePropertyId,
    venueId: "pool-mini-mercado",
    name: "Marketplace Pickup",
    type: "marketplace-pickup",
    fee: 0,
    enabled: true,
    estimatedMinutes: 10,
  },
  {
    id: "pool-pickup",
    propertyId: activePropertyId,
    venueId: "poolside-dining",
    name: "Pool Pickup",
    type: "pool-pickup",
    fee: 0,
    enabled: true,
    estimatedMinutes: 20,
  },
  {
    id: "chair-delivery",
    propertyId: activePropertyId,
    venueId: "poolside-dining",
    name: "Chair Delivery",
    type: "chair-delivery",
    fee: 4,
    enabled: false,
    estimatedMinutes: 25,
  },
  {
    id: "sunset-pointe-pickup",
    propertyId: activePropertyId,
    venueId: "sunset-pointe-bar",
    name: "Sunset Pointe Pickup",
    type: "sunset-pointe-pickup",
    fee: 0,
    enabled: true,
    estimatedMinutes: 18,
  },
  {
    id: "dine-in",
    propertyId: activePropertyId,
    venueId: "sunset-pointe-dining",
    name: "Dine-In",
    type: "dine-in",
    fee: 0,
    enabled: false,
    estimatedMinutes: 0,
  },
  {
    id: "reservation-only",
    propertyId: activePropertyId,
    venueId: "amicasa",
    name: "Reservation Only",
    type: "reservation-only",
    fee: 0,
    enabled: true,
    estimatedMinutes: 0,
  },
];

export const reservationExperiences: ReservationExperience[] = [
  {
    id: "amicasa",
    propertyId: activePropertyId,
    venueId: "amicasa",
    revenueCenterId: "amicasa",
    name: "Amicasa Private Dining",
    description: "A chef-guided, reservation-only hands-on tasting experience for up to 12 guests.",
    capacity: 12,
    reservationOnly: true,
  },
];

export const eventAnnouncements: EventAnnouncement[] = [
  {
    id: "sunset-feed-catch",
    propertyId: activePropertyId,
    venueId: "sunset-pointe-dining",
    revenueCenterId: "sunset-dining",
    title: "Today's Fresh Catch",
    body: "Ask about today's Gulf catch and smoked fish features.",
    featured: true,
  },
  {
    id: "sunset-feed-smoker",
    propertyId: activePropertyId,
    venueId: "sunset-pointe-dining",
    revenueCenterId: "sunset-dining",
    title: "Just Off the Smoker",
    body: "Smoked land and ocean specialties rotate daily.",
  },
  {
    id: "sunset-feed-amicasa",
    propertyId: activePropertyId,
    venueId: "amicasa",
    revenueCenterId: "amicasa",
    title: "Amicasa",
    body: "Private dining requests available for up to 12 guests.",
  },
];

export const activeProperty = properties.find((property) => property.id === activePropertyId) ?? properties[0];
