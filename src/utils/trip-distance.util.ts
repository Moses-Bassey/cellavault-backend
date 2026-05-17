/**
 * Calculates trip distance in kilometers using the Haversine formula.
 * Returns undefined if any coordinate is missing.
 */
export function calculateTripDistanceKm(
  pickupLatitude?: number | null,
  pickupLongitude?: number | null,
  dropoffLatitude?: number | null,
  dropoffLongitude?: number | null,
): number | undefined {
//   console.log('pickupLatitude: ', pickupLatitude,
//     '\npickupLongitude: ',
//     pickupLongitude, '\ndropoffLatitude: ', dropoffLatitude, 
//     '\ndropoffLongitude: ', dropoffLongitude);
  if (
    pickupLatitude == null ||
    pickupLongitude == null ||
    dropoffLatitude == null ||
    dropoffLongitude == null
  ) {
    return undefined;
  }

  const toRad = (value: number): number =>
    (value * Math.PI) / 180;

  const EARTH_RADIUS_KM = 6371;

  const dLat = toRad(dropoffLatitude - pickupLatitude);
  const dLon = toRad(dropoffLongitude - pickupLongitude);

  const lat1 = toRad(pickupLatitude);
  const lat2 = toRad(dropoffLatitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceKm = EARTH_RADIUS_KM * c;
  return Number(distanceKm.toFixed(3));
}