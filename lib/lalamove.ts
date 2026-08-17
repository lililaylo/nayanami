// Distance-based delivery fee estimation — no external API key needed
// Pickup: East Ortigas Mansions, C. Raymundo Ave, Pasig City
const PICKUP_LAT = 14.5761;
const PICKUP_LNG = 121.0607;

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

// Lalamove PH motorcycle pricing: ₱55 base (first 3 km), ₱10/km after
function estimateFare(km: number): number {
  const base = 55;
  const freeKm = 3;
  const perKm = 10;
  const extra = Math.max(0, km - freeKm);
  return Math.ceil(base + extra * perKm);
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
  const km = haversineKm(PICKUP_LAT, PICKUP_LNG, coords.lat, coords.lng);
  return estimateFare(km);
}
