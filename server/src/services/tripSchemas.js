import { z } from 'zod';

export const createTripSchema = z.object({
  title: z.string().trim().min(1).max(200).default('My Trip'),
  travel_style: z.enum(['chill', 'foodie', 'photographer', 'adventure', 'budget']),
  travel_date: z.string().optional(),
  total_days: z.number().int().min(1).max(30).default(1),
  origin_name: z.string().trim().min(1).max(255),
  origin_lat: z.number().min(-90).max(90),
  origin_lng: z.number().min(-180).max(180),
  destination_name: z.string().trim().min(1).max(255),
  destination_lat: z.number().min(-90).max(90),
  destination_lng: z.number().min(-180).max(180),
  corridor_width_km: z.number().min(1).max(50).default(10),
  route_geometry: z.string().optional(),
  route_distance_m: z.number().int().optional(),
  route_duration_s: z.number().int().optional(),
});

export const updateTripSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  travel_style: z.enum(['chill', 'foodie', 'photographer', 'adventure', 'budget']).optional(),
  travel_date: z.string().optional(),
  total_days: z.number().int().min(1).max(30).optional(),
  corridor_width_km: z.number().min(1).max(50).optional(),
});
