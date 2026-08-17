import crypto from "crypto";

// East Ortigas Mansions, C. Raymundo Ave, Pasig City
const PICKUP_LAT = "14.576100";
const PICKUP_LNG = "121.060700";
const PICKUP_ADDRESS = "East Ortigas Mansions, C. Raymundo Avenue, Pasig City";

async function geocode(address: string): Promise<{ lat: string; lng: string } | null> {
  try {
    const query = encodeURIComponent(`${address}, Philippines`);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
      { headers: { "User-Agent": "Nayanami/1.0" } }
    );
    const data = await res.json();
    if (!Array.isArray(data) || !data.length) return null;
    return { lat: data[0].lat, lng: data[0].lon };
  } catch {
    return null;
  }
}

export async function getDeliveryFee(deliveryAddress: string): Promise<number | null> {
  const apiKey = process.env.LALAMOVE_API_KEY;
  const apiSecret = process.env.LALAMOVE_API_SECRET;
  if (!apiKey || !apiSecret) return null;

  const dropCoords = await geocode(deliveryAddress);
  if (!dropCoords) return null;

  const method = "POST";
  const path = "/v3/quotations";
  const timestamp = Date.now().toString();

  const body = JSON.stringify({
    data: {
      serviceType: "MOTORCYCLE",
      language: "en_PH",
      stops: [
        {
          coordinates: { lat: PICKUP_LAT, lng: PICKUP_LNG },
          address: PICKUP_ADDRESS,
        },
        {
          coordinates: { lat: dropCoords.lat, lng: dropCoords.lng },
          address: deliveryAddress,
        },
      ],
    },
  });

  const rawSignature = `${timestamp}\r\n${method}\r\n${path}\r\n\r\n${body}`;
  const signature = crypto.createHmac("sha256", apiSecret).update(rawSignature).digest("hex");

  try {
    const res = await fetch(`https://rest.lalamove.com${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `hmac ${apiKey}:${timestamp}:${signature}`,
        Market: "PH",
        "Request-ID": crypto.randomUUID(),
      },
      body,
    });

    if (!res.ok) return null;
    const json = await res.json();
    const total = json?.priceBreakdown?.total;
    if (!total) return null;
    return Math.ceil(parseFloat(total));
  } catch {
    return null;
  }
}
