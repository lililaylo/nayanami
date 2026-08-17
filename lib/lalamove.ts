// Pickup: Santa Lucia, Pasig City
const PICKUP_LAT = 14.5597;
const PICKUP_LNG = 121.0739;

// Approximate centroids for each Pasig barangay
const BARANGAY_COORDS: Record<string, [number, number]> = {
  "Bagong Ilog":      [14.5561, 121.0828],
  "Bagong Katipunan": [14.5717, 121.0506],
  "Bambang":          [14.5644, 121.0650],
  "Buting":           [14.5578, 121.0678],
  "Caniogan":         [14.5756, 121.0567],
  "Dela Paz":         [14.5536, 121.0739],
  "Kalawaan":         [14.5681, 121.0514],
  "Kapasigan":        [14.5700, 121.0556],
  "Kapitolyo":        [14.5756, 121.0522],
  "Malinao":          [14.5703, 121.0736],
  "Manggahan":        [14.5878, 121.0900],
  "Maybunga":         [14.5778, 121.0667],
  "Oranbo":           [14.5806, 121.0683],
  "Palatiw":          [14.5733, 121.0656],
  "Pinagbuhatan":     [14.5556, 121.0878],
  "Pineda":           [14.5622, 121.0739],
  "Rosario":          [14.5739, 121.0767],
  "Sagad":            [14.5628, 121.0861],
  "San Antonio":      [14.5778, 121.0534],
  "San Joaquin":      [14.5639, 121.0628],
  "San Jose":         [14.5706, 121.0617],
  "San Miguel":       [14.5744, 121.0678],
  "San Nicolas":      [14.5797, 121.0747],
  "Santa Cruz":       [14.5606, 121.0711],
  "Santa Lucia":      [14.5597, 121.0739],
  "Santa Rosa":       [14.5750, 121.0611],
  "Santo Tomas":      [14.5661, 121.0761],
  "Santolan":         [14.5933, 121.0789],
  "Sumilang":         [14.5700, 121.0500],
  "Ugong":            [14.5833, 121.0478],
};

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

export function getDeliveryFeeForBarangay(barangay: string): number | null {
  const coords = BARANGAY_COORDS[barangay];
  if (!coords) return null;
  const km = haversineKm(PICKUP_LAT, PICKUP_LNG, coords[0], coords[1]);
  return calculateFare(km);
}
