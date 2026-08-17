// Pickup: East Ortigas Mansions, C. Raymundo Ave, Pasig City
const PICKUP_LAT = 14.5761;
const PICKUP_LNG = 121.0607;

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Base ₱49 + ₱6/km (0–5km) + ₱5/km (above 5km)
export function calculateFare(km: number): number {
  const base = 49;
  if (km <= 5) return Math.ceil(base + km * 6);
  return Math.ceil(base + 5 * 6 + (km - 5) * 5);
}

export function getDeliveryFeeFromCoords(lat: number, lng: number): number {
  const km = haversineKm(PICKUP_LAT, PICKUP_LNG, lat, lng);
  return calculateFare(km);
}

async function geocode(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const query = encodeURIComponent(`${address}, Philippines`);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
      { headers: { "User-Agent": "Nayanami/1.0" } }
    );
    const data = await res.json();
    if (!Array.isArray(data) || !data.length) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

export async function getDeliveryFee(deliveryAddress: string): Promise<number | null> {
  const coords = await geocode(deliveryAddress);
  if (!coords) return null;
  return getDeliveryFeeFromCoords(coords.lat, coords.lng);
}
