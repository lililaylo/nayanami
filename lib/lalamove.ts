// Pickup: Santa Lucia, Pasig City
const PICKUP_LAT = 14.5597;
const PICKUP_LNG = 121.0739;

export const MAX_DELIVERY_KM = 5;

export type ServiceableLocation = {
  barangay: string;
  city: string;
  lat: number;
  lng: number;
};

const ALL_LOCATIONS: ServiceableLocation[] = [
  // Pasig City
  { barangay: "Bagong Ilog",      city: "Pasig City", lat: 14.5561, lng: 121.0828 },
  { barangay: "Bagong Katipunan", city: "Pasig City", lat: 14.5717, lng: 121.0506 },
  { barangay: "Bambang",          city: "Pasig City", lat: 14.5644, lng: 121.0650 },
  { barangay: "Buting",           city: "Pasig City", lat: 14.5578, lng: 121.0678 },
  { barangay: "Caniogan",         city: "Pasig City", lat: 14.5756, lng: 121.0567 },
  { barangay: "Dela Paz",         city: "Pasig City", lat: 14.5536, lng: 121.0739 },
  { barangay: "Kalawaan",         city: "Pasig City", lat: 14.5681, lng: 121.0514 },
  { barangay: "Kapasigan",        city: "Pasig City", lat: 14.5700, lng: 121.0556 },
  { barangay: "Kapitolyo",        city: "Pasig City", lat: 14.5756, lng: 121.0522 },
  { barangay: "Malinao",          city: "Pasig City", lat: 14.5703, lng: 121.0736 },
  { barangay: "Manggahan",        city: "Pasig City", lat: 14.5878, lng: 121.0900 },
  { barangay: "Maybunga",         city: "Pasig City", lat: 14.5778, lng: 121.0667 },
  { barangay: "Oranbo",           city: "Pasig City", lat: 14.5806, lng: 121.0683 },
  { barangay: "Palatiw",          city: "Pasig City", lat: 14.5733, lng: 121.0656 },
  { barangay: "Pinagbuhatan",     city: "Pasig City", lat: 14.5556, lng: 121.0878 },
  { barangay: "Pineda",           city: "Pasig City", lat: 14.5622, lng: 121.0739 },
  { barangay: "Rosario",          city: "Pasig City", lat: 14.5739, lng: 121.0767 },
  { barangay: "Sagad",            city: "Pasig City", lat: 14.5628, lng: 121.0861 },
  { barangay: "San Antonio",      city: "Pasig City", lat: 14.5778, lng: 121.0534 },
  { barangay: "San Joaquin",      city: "Pasig City", lat: 14.5639, lng: 121.0628 },
  { barangay: "San Jose",         city: "Pasig City", lat: 14.5706, lng: 121.0617 },
  { barangay: "San Miguel",       city: "Pasig City", lat: 14.5744, lng: 121.0678 },
  { barangay: "San Nicolas",      city: "Pasig City", lat: 14.5797, lng: 121.0747 },
  { barangay: "Santa Cruz",       city: "Pasig City", lat: 14.5606, lng: 121.0711 },
  { barangay: "Santa Lucia",      city: "Pasig City", lat: 14.5597, lng: 121.0739 },
  { barangay: "Santa Rosa",       city: "Pasig City", lat: 14.5750, lng: 121.0611 },
  { barangay: "Santo Tomas",      city: "Pasig City", lat: 14.5661, lng: 121.0761 },
  { barangay: "Santolan",         city: "Pasig City", lat: 14.5933, lng: 121.0789 },
  { barangay: "Sumilang",         city: "Pasig City", lat: 14.5700, lng: 121.0500 },
  { barangay: "Ugong",            city: "Pasig City", lat: 14.5833, lng: 121.0478 },
  // Cainta, Rizal
  { barangay: "Sto. Domingo",  city: "Cainta",  lat: 14.5656, lng: 121.1072 },
  { barangay: "San Juan",      city: "Cainta",  lat: 14.5542, lng: 121.1097 },
  { barangay: "San Andres",    city: "Cainta",  lat: 14.5725, lng: 121.1094 },
  { barangay: "San Isidro",    city: "Cainta",  lat: 14.5597, lng: 121.1119 },
  { barangay: "Sto. Nino",     city: "Cainta",  lat: 14.5817, lng: 121.1097 },
  { barangay: "Santa Rosa",    city: "Cainta",  lat: 14.5636, lng: 121.1181 },
  { barangay: "San Roque",     city: "Cainta",  lat: 14.5778, lng: 121.1144 },
  // Mandaluyong
  { barangay: "Addition Hills",        city: "Mandaluyong", lat: 14.5636, lng: 121.0453 },
  { barangay: "Bagong Silang",         city: "Mandaluyong", lat: 14.5761, lng: 121.0411 },
  { barangay: "Barangka Drive",        city: "Mandaluyong", lat: 14.5756, lng: 121.0417 },
  { barangay: "Barangka Ibaba",        city: "Mandaluyong", lat: 14.5772, lng: 121.0450 },
  { barangay: "Barangka Itaas",        city: "Mandaluyong", lat: 14.5783, lng: 121.0428 },
  { barangay: "Barangka Ilaya",        city: "Mandaluyong", lat: 14.5750, lng: 121.0394 },
  { barangay: "Buayang Bato",          city: "Mandaluyong", lat: 14.5842, lng: 121.0411 },
  { barangay: "Burol",                 city: "Mandaluyong", lat: 14.5700, lng: 121.0461 },
  { barangay: "Daang Bakal",           city: "Mandaluyong", lat: 14.5797, lng: 121.0483 },
  { barangay: "Hagdan Bato Itaas",     city: "Mandaluyong", lat: 14.5872, lng: 121.0450 },
  { barangay: "Hagdan Bato Libis",     city: "Mandaluyong", lat: 14.5858, lng: 121.0472 },
  { barangay: "Harapin Ang Bukas",     city: "Mandaluyong", lat: 14.5839, lng: 121.0433 },
  { barangay: "Highway Hills",         city: "Mandaluyong", lat: 14.5894, lng: 121.0467 },
  { barangay: "Hulo",                  city: "Mandaluyong", lat: 14.5817, lng: 121.0456 },
  { barangay: "Mabini-J. Rizal",       city: "Mandaluyong", lat: 14.5717, lng: 121.0472 },
  { barangay: "Malamig",               city: "Mandaluyong", lat: 14.5753, lng: 121.0494 },
  { barangay: "Plainview",             city: "Mandaluyong", lat: 14.5856, lng: 121.0572 },
  { barangay: "Pleasant Hills",        city: "Mandaluyong", lat: 14.5714, lng: 121.0439 },
  { barangay: "Poblacion",             city: "Mandaluyong", lat: 14.5728, lng: 121.0508 },
  { barangay: "San Andres",            city: "Mandaluyong", lat: 14.5828, lng: 121.0522 },
  { barangay: "Vergara",               city: "Mandaluyong", lat: 14.5847, lng: 121.0539 },
  { barangay: "Wack-Wack Greenhills",  city: "Mandaluyong", lat: 14.5811, lng: 121.0450 },
];

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Base ₱49 + ₱6/km (0–5 km) + ₱5/km (above 5 km)
function calculateFare(km: number): number {
  const base = 49;
  if (km <= 5) return Math.ceil(base + km * 6);
  return Math.ceil(base + 5 * 6 + (km - 5) * 5);
}

// Pre-computed list of serviceable locations, Pasig first then Mandaluyong alphabetically
export const SERVICEABLE_LOCATIONS: ServiceableLocation[] = ALL_LOCATIONS.filter((loc) => {
  const km = haversineKm(PICKUP_LAT, PICKUP_LNG, loc.lat, loc.lng);
  return km <= MAX_DELIVERY_KM;
}).sort((a, b) => {
  const cityOrder: Record<string, number> = { "Pasig City": 0, "Cainta": 1, "Mandaluyong": 2 };
  const ca = cityOrder[a.city] ?? 99;
  const cb = cityOrder[b.city] ?? 99;
  if (ca !== cb) return ca - cb;
  return a.barangay.localeCompare(b.barangay);
});

export function getDeliveryFeeForLocation(barangay: string, city: string): number | null {
  const loc = SERVICEABLE_LOCATIONS.find(
    (l) => l.barangay === barangay && l.city === city
  );
  if (!loc) return null;
  const km = haversineKm(PICKUP_LAT, PICKUP_LNG, loc.lat, loc.lng);
  return calculateFare(km);
}
