import db from '../config/db.js';
import crypto from 'crypto';

export async function createTrip(userId, data) {
  const result = await db.query(
    `INSERT INTO trips (user_id, title, travel_style, travel_date, total_days,
       origin_name, origin_location, destination_name, destination_location,
       corridor_width_km, route_geometry, route_distance_m, route_duration_s)
     VALUES ($1, $2, $3, $4, $5, $6,
       ST_SetSRID(ST_MakePoint($7, $8), 4326)::geography,
       $9,
       ST_SetSRID(ST_MakePoint($10, $11), 4326)::geography,
       $12, $13, $14, $15)
     RETURNING id, title, travel_style, travel_date, total_days,
       origin_name, destination_name, corridor_width_km,
       route_distance_m, route_duration_s, feasibility_status,
       created_at`,
    [
      userId, data.title, data.travel_style,
      data.travel_date || null, data.total_days,
      data.origin_name, data.origin_lng, data.origin_lat,
      data.destination_name, data.destination_lng, data.destination_lat,
      data.corridor_width_km, data.route_geometry || null,
      data.route_distance_m || null, data.route_duration_s || null,
    ]
  );
  return result.rows[0];
}

export async function getTripsByUser(userId) {
  const result = await db.query(
    `SELECT id, title, travel_style, travel_date, total_days,
       origin_name, destination_name, corridor_width_km,
       route_distance_m, route_duration_s, feasibility_status,
       share_token, is_public, created_at, updated_at
     FROM trips WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
}

export async function getTripById(tripId, userId) {
  const result = await db.query(
    `SELECT id, user_id, title, travel_style, travel_date, total_days,
       origin_name, destination_name, corridor_width_km,
       route_distance_m, route_duration_s, feasibility_status,
       total_trip_duration_s, share_token, is_public, created_at, updated_at
     FROM trips WHERE id = $1 AND user_id = $2`,
    [tripId, userId]
  );
  return result.rows[0] || null;
}

export async function getTripByShareToken(token) {
  const result = await db.query(
    `SELECT id, user_id, title, travel_style, travel_date, total_days,
       origin_name, destination_name, corridor_width_km,
       route_distance_m, route_duration_s, feasibility_status,
       created_at, updated_at
     FROM trips WHERE share_token = $1 AND is_public = TRUE`,
    [token]
  );
  return result.rows[0] || null;
}

export async function updateTrip(tripId, userId, data) {
  const fields = [];
  const values = [];
  let idx = 1;

  for (const [key, val] of Object.entries(data)) {
    if (val !== undefined) {
      fields.push(`${key} = $${idx++}`);
      values.push(val);
    }
  }

  if (fields.length === 0) return null;

  values.push(tripId, userId);
  const result = await db.query(
    `UPDATE trips SET ${fields.join(', ')}
     WHERE id = $${idx++} AND user_id = $${idx}
     RETURNING id, title, travel_style, travel_date, total_days,
       origin_name, destination_name, corridor_width_km,
       route_distance_m, route_duration_s, feasibility_status,
       share_token, is_public, created_at, updated_at`,
    values
  );
  return result.rows[0] || null;
}

export async function deleteTrip(tripId, userId) {
  const result = await db.query(
    'DELETE FROM trips WHERE id = $1 AND user_id = $2 RETURNING id',
    [tripId, userId]
  );
  return result.rows[0] || null;
}

export async function generateShareToken(tripId, userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const result = await db.query(
    `UPDATE trips SET share_token = $1, is_public = TRUE
     WHERE id = $2 AND user_id = $3
     RETURNING share_token`,
    [token, tripId, userId]
  );
  return result.rows[0] || null;
}
