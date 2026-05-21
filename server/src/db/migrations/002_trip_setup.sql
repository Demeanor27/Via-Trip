-- =====================================================
-- Migration: 002_trip_setup
-- Creates place, trip, and review tables (PostGIS-dependent)
-- Also installs PostGIS if not already present
-- =====================================================

CREATE EXTENSION IF NOT EXISTS postgis;

-- places
CREATE TABLE IF NOT EXISTS places (
  id              SERIAL PRIMARY KEY,
  owner_id        INTEGER                    REFERENCES users(id) ON DELETE SET NULL,
  name            VARCHAR(200)               NOT NULL,
  description     TEXT,
  category        place_category             NOT NULL,
  status          place_status               NOT NULL DEFAULT 'pending',
  address         TEXT,
  opening_hours   JSONB,
  location        GEOGRAPHY(POINT, 4326)     NOT NULL,
  avg_rating      NUMERIC(3, 2)              DEFAULT 0.00,
  review_count    INTEGER                    NOT NULL DEFAULT 0,
  rejection_note  TEXT,
  created_at      TIMESTAMPTZ                NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ                NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_places_location ON places USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_places_status   ON places(status);
CREATE INDEX IF NOT EXISTS idx_places_category ON places(category);
CREATE INDEX IF NOT EXISTS idx_places_owner    ON places(owner_id);

-- place_images
CREATE TABLE IF NOT EXISTS place_images (
  id         SERIAL PRIMARY KEY,
  place_id   INTEGER     NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  url        TEXT        NOT NULL,
  is_primary BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_place_images_place ON place_images(place_id);

-- trips
CREATE TABLE IF NOT EXISTS trips (
  id                    SERIAL PRIMARY KEY,
  user_id               INTEGER                      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title                 VARCHAR(200)                 NOT NULL DEFAULT 'My Trip',
  travel_style          travel_style                 NOT NULL,
  travel_date           DATE,
  total_days            INTEGER                      NOT NULL DEFAULT 1,
  origin_name           VARCHAR(255)                 NOT NULL,
  origin_location       GEOGRAPHY(POINT, 4326)       NOT NULL,
  destination_name      VARCHAR(255)                 NOT NULL,
  destination_location  GEOGRAPHY(POINT, 4326)       NOT NULL,
  route_geometry        GEOGRAPHY(LINESTRING, 4326),
  route_distance_m      INTEGER,
  route_duration_s      INTEGER,
  corridor_width_km     NUMERIC(5, 2)  NOT NULL DEFAULT 10.00
                          CONSTRAINT chk_corridor_min CHECK (corridor_width_km >= 1)
                          CONSTRAINT chk_corridor_max CHECK (corridor_width_km <= 50),
  feasibility_status    feasibility_status,
  total_trip_duration_s INTEGER,
  share_token           VARCHAR(64)    UNIQUE,
  is_public             BOOLEAN        NOT NULL DEFAULT FALSE,
  created_at            TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trips_user        ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_share_token ON trips(share_token);
CREATE INDEX IF NOT EXISTS idx_trips_origin      ON trips USING GIST(origin_location);
CREATE INDEX IF NOT EXISTS idx_trips_destination ON trips USING GIST(destination_location);
CREATE INDEX IF NOT EXISTS idx_trips_route       ON trips USING GIST(route_geometry);

-- trip_waypoints
CREATE TABLE IF NOT EXISTS trip_waypoints (
  id                        SERIAL PRIMARY KEY,
  trip_id                   INTEGER     NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  place_id                  INTEGER     NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  position                  INTEGER     NOT NULL,
  estimated_stop_duration_s INTEGER     NOT NULL,
  segment_distance_m        INTEGER,
  segment_duration_s        INTEGER,
  note                      TEXT,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(trip_id, place_id),
  UNIQUE(trip_id, position)
);

CREATE INDEX IF NOT EXISTS idx_trip_waypoints_trip  ON trip_waypoints(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_waypoints_place ON trip_waypoints(place_id);

-- reviews
CREATE TABLE IF NOT EXISTS reviews (
  id         SERIAL PRIMARY KEY,
  place_id   INTEGER     NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  user_id    INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating     SMALLINT    NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body       TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(place_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_place ON reviews(place_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user  ON reviews(user_id);

-- trigger: auto-update avg_rating on places
CREATE OR REPLACE FUNCTION update_place_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE places
  SET
    avg_rating   = (SELECT ROUND(AVG(rating)::NUMERIC, 2) FROM reviews WHERE place_id = COALESCE(NEW.place_id, OLD.place_id)),
    review_count = (SELECT COUNT(*) FROM reviews WHERE place_id = COALESCE(NEW.place_id, OLD.place_id)),
    updated_at   = NOW()
  WHERE id = COALESCE(NEW.place_id, OLD.place_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_place_rating ON reviews;
CREATE TRIGGER trg_update_place_rating
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_place_rating();

-- trigger: auto-populate estimated_stop_duration_s from category
CREATE OR REPLACE FUNCTION set_waypoint_stop_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.estimated_stop_duration_s IS NULL THEN
    SELECT COALESCE(sdr.stop_duration_s, 1800)
      INTO NEW.estimated_stop_duration_s
      FROM places p
      LEFT JOIN stop_duration_reference sdr ON sdr.category = p.category
      WHERE p.id = NEW.place_id;
  END IF;
  IF NEW.estimated_stop_duration_s IS NULL THEN
    NEW.estimated_stop_duration_s := 1800;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_waypoint_stop_duration ON trip_waypoints;
CREATE TRIGGER trg_set_waypoint_stop_duration
BEFORE INSERT ON trip_waypoints
FOR EACH ROW EXECUTE FUNCTION set_waypoint_stop_duration();

-- trigger: auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_places_updated_at ON places;
CREATE TRIGGER trg_places_updated_at BEFORE UPDATE ON places FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_trips_updated_at ON trips;
CREATE TRIGGER trg_trips_updated_at BEFORE UPDATE ON trips FOR EACH ROW EXECUTE FUNCTION set_updated_at();
